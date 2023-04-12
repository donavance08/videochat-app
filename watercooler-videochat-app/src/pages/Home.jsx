import React, {
	useEffect,
	useContext,
	useState,
	useCallback,
	useRef,
} from 'react';
import { Device } from 'twilio-client';
import UserContext from '../contexts/UserContext';
import Contacts from '../components/Contacts';
import Messaging from '../components/Messaging';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import VideoChat from '../components/VideoChat';
import IncomingVideoCallDialog from '../components/IncomingVideoCallDialog';
import CancelCallDialog from '../components/CancelCallDialog';
import {
	setActiveContactId,
	setActiveContactName,
	setActiveContactPhoneNumber,
} from '../redux/chat';
import PhoneCall from '../components/PhoneCall';
import IncomingPhoneCallDialog from '../components/IncomingPhoneCallDialog';
import PhoneDialer from '../components/PhoneDialer';
const SimplePeer = require('simple-peer');

export default function Home({ component }) {
	const {
		socket,
		token,
		id,
		personalStream,
		setContactStream,
		showPendingCallDialog,
		setShowPendingCallDialog,
		hasActiveCall,
		setHasActiveCall,
		setCallInitiator,
		showCancelCallDialog,
		setShowCancelCallDialog,
		connectionRef,
		setPersonalStream,
		turnCredential,
		setTurnCredential,
	} = useContext(UserContext);

	const { activeContactId } = useSelector((state) => state.chat);
	const [hasIncomingCall, setHasIncomingCall] = useState(false);
	const [isCallLoading, setIsCallLoading] = useState();
	const [callData, setCallData] = useState(null);
	const [callStatus, setCallStatus] = useState('');

	const navigate = useNavigate();
	const dispatch = useDispatch();
	const isPhoneMountedRef = useRef(false);
	const [contactSignal, setContactSignal] = useState();
	const [cancelReason, setCancelReason] = useState();
	const incomingCallCountRef = useRef(0);

	const answerVideoCallHandler = () => {
		setHasActiveCall(true);

		const peer = new SimplePeer({
			initiator: false,
			trickle: false,
			stream: personalStream,
			config: {
				iceServers: turnCredential,
			},
		});

		peer.on('signal', (payload) => {
			socket.current.emit('accept video call', {
				signal: payload,
				to: activeContactId,
			});
		});

		peer.on('stream', (stream) => {
			setContactStream(stream);
		});

		peer.signal(contactSignal);
		connectionRef.current = peer;
		navigate('/home/video-chat');
	};

	const declineVideoCallHandler = () => {
		socket.current.emit('decline video call', {
			to: activeContactId,
			reason: 'declined',
		});

		setShowPendingCallDialog(false);
		setContactSignal(null);
	};

	const endVideoCallHandler = () => {
		if (hasActiveCall) {
			socket.current.emit('end video call', {
				to: activeContactId,
				reason: 'cancelled',
			});
			setHasActiveCall(false);
			connectionRef.current.destroy();
		}
	};

	/** initiate socket.io and mediaDevices */
	useEffect(() => {
		if (socket.current) {
			socket.current.connect();
			return;
		}

		socket.current = io(`${process.env.REACT_APP_API_URL}`, {
			extraHeaders: {
				id,
			},
			reconnection: true,
			reconnectionAttempts: Infinity,
			reconnectionDelay: 5000,
		});

		navigator.mediaDevices
			.getUserMedia({ video: true, audio: true })
			.then((stream) => {
				setPersonalStream(stream);
			})
			.catch((error) => console.log(error));
	}, [token, id, setPersonalStream, socket]);

	/** Fetch Twilio token */
	const fetchToken = useCallback(async () => {
		return await fetch(`${process.env.REACT_APP_API_URL}/api/call/token`)
			.then((response) => response.json())
			.then((result) => {
				if (result.status === 'OK') {
					return result;
				}

				console.error(result.message);
			})
			.catch((err) => {
				console.error(err.message);
			});
	}, []);

	/** Setting Twilio Device listener */
	useEffect(() => {
		fetchToken().then((data) => {
			Device.setup(data.token, { tokenRefreshMs: 30000 });
		});

		Device.on('incoming', (call) => {
			call.accept();

			setHasActiveCall(true);
			setIsCallLoading(false);
			setCallStatus('Call in progress');
		});

		Device.on('disconnect', (call) => {
			setHasIncomingCall(false);
			setHasActiveCall(false);
			setCallData(null);
			setCallStatus('Call Completed');
			incomingCallCountRef.current--;
		});

		Device.on('tokenWillExpire', () => {
			fetchToken().then((data) => Device.updateToken(data.token));
		});
	}, [fetchToken, setHasActiveCall]);

	const sendCallResponse = (callData, response) => {
		fetch(
			`${process.env.REACT_APP_API_URL}/api/call/callResponse/${response}`,
			{
				method: 'POST',
				headers: {
					'Content-type': 'application/json',
				},
				body: JSON.stringify({
					CallSid: callData.data.CallSid,
				}),
			}
		);
	};

	const acceptIncomingPhoneCall = (callData, response) => {
		sendCallResponse(callData, response);
		setHasIncomingCall(false);
		setIsCallLoading(true);
		navigate(`/home/phone/${callData.from}/`);
	};

	const rejectIncomingPhoneCall = (callData, response) => {
		sendCallResponse(callData, response);

		if (incomingCallCountRef.current > 1) {
			incomingCallCountRef.current--;
			return;
		}
		console.log(incomingCallCountRef.current);
		setHasActiveCall(false);
		setHasIncomingCall(false);
		setCallStatus('Call Completed');
		incomingCallCountRef.current--;
	};

	/**
	 * socket will listen for incoming video chat
	 * also redirect back to login if user is not yet logged in
	 */
	useEffect(() => {
		if (!token) {
			navigate('/');
		}

		const activeSocket = socket.current;

		const incomingPhoneCallListener = (payload) => {
			incomingCallCountRef.current = incomingCallCountRef.current + 1;

			if (hasIncomingCall || hasActiveCall) {
				rejectIncomingPhoneCall(payload, 'reject');
				return;
			}

			dispatch(setActiveContactPhoneNumber(''));
			setCallStatus('Incoming Call from:');
			setHasIncomingCall(true);
			setCallData(payload);
		};

		activeSocket.on('incoming phone call', incomingPhoneCallListener);

		const socketDisconnectedListener = (disconnectReason) => {
			if (disconnectReason === 'io client disconnect') {
				return;
			}
			setTimeout(() => {
				activeSocket.connect();
			}, 10000);
		};

		activeSocket.on('disconnect', socketDisconnectedListener);

		const initiateCallListener = (payload) => {
			if (hasActiveCall) {
				return;
			}

			setShowPendingCallDialog(true);
			setCallInitiator(false);
			dispatch(setActiveContactId(payload.from));
			dispatch(setActiveContactName(payload.name));
			setContactSignal(payload.signal);
		};

		activeSocket.on('initiate video call', initiateCallListener);

		const declineCallHandler = (payload) => {
			if (showPendingCallDialog) {
				setShowPendingCallDialog(false);
				setShowCancelCallDialog(true);
				setCancelReason(payload.reason);
				connectionRef.current.destroy();
			}
		};
		activeSocket.on('decline video call', declineCallHandler);

		/**
		 * Handler for contact initiated end video call
		 *
		 *  */
		const endVideoCallListener = (payload) => {
			if (hasActiveCall) {
				setShowCancelCallDialog(true);
				setCancelReason(payload.reason);
				setHasActiveCall(false);
				connectionRef.current.destroy();
			}
		};

		activeSocket.on('end video call', endVideoCallListener);

		const userDisconnectHandler = ({ id }) => {
			if (hasActiveCall && activeContactId === id) {
				setShowCancelCallDialog(true);
				setCancelReason('cancelled');
				connectionRef.current.destroy();
				setHasActiveCall(false);
			}
		};

		activeSocket.on('user disconnect', userDisconnectHandler);

		return () => {
			activeSocket.off('user disconnect', userDisconnectHandler);
			activeSocket.off('end video call', endVideoCallListener);
			activeSocket.off('decline video call', declineCallHandler);
			activeSocket.off('initiate video call', initiateCallListener);
			activeSocket.off('incoming call', incomingPhoneCallListener);
			activeSocket.off('incoming phone call', incomingPhoneCallListener);
			activeSocket.off('disconnect', socketDisconnectedListener);
		};
	});

	/** Get TURN credentials */
	useEffect(() => {
		if (!turnCredential === '') {
			return;
		}

		fetch(`${process.env.REACT_APP_API_URL}/api/video/turnCredential`, {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		})
			.then((response) => response.json())
			.then((result) => {
				setTurnCredential(result.data.token.iceServers);
			})
			.catch((error) => {
				console.error(error.message);
			});
	}, [token, setTurnCredential, turnCredential]);

	return (
		<div className='chat-page-container d-flex flex-row '>
			{showPendingCallDialog && (
				<IncomingVideoCallDialog
					callHandlers={{ answerVideoCallHandler, declineVideoCallHandler }}
				/>
			)}
			{showCancelCallDialog && <CancelCallDialog cancelReason={cancelReason} />}
			<Contacts />
			{component === 'chat' && (
				<Messaging
					activeComponent='chat'
					column='6'
				/>
			)}
			{component === 'videoChat' && (
				<>
					<VideoChat endVideoCallHandler={endVideoCallHandler} />
					<Messaging
						activeComponent='chat'
						column='3'
					/>
				</>
			)}
			{component === 'sms' && (
				<Messaging
					activeComponent='sms'
					column='6'
				/>
			)}
			{component === 'phone' && (
				<PhoneCall>
					<PhoneDialer
						hasIncomingCall={hasIncomingCall}
						callData={callData}
						rejectIncomingPhoneCall={rejectIncomingPhoneCall}
						acceptIncomingPhoneCall={acceptIncomingPhoneCall}
						callStatus={callStatus}
						isCallLoading={isCallLoading}
						setCallStatus={setCallStatus}
						device={Device}
						isSelfMountedRef={isPhoneMountedRef}
					/>
				</PhoneCall>
			)}
			{hasIncomingCall && !isPhoneMountedRef.current && (
				<IncomingPhoneCallDialog
					callData={callData}
					isCallLoading={isCallLoading}
					rejectIncomingPhoneCall={rejectIncomingPhoneCall}
					acceptIncomingPhoneCall={acceptIncomingPhoneCall}
				/>
			)}
		</div>
	);
}
