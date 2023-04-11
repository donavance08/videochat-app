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
	} = useContext(UserContext);
	const { activeContactId } = useSelector((state) => state.chat);
	const [hasIncomingCall, setHasIncomingCall] = useState(false);
	const [callData, setCallData] = useState(null);
	const [callStatus, setCallStatus] = useState('');

	const navigate = useNavigate();
	const dispatch = useDispatch();
	const isPhoneMountedRef = useRef(false);
	const [contactSignal, setContactSignal] = useState();
	const [cancelReason, setCancelReason] = useState();
	const incomingCallCountRef = useRef(0);

	/**
	 * handler for the answercall button of the incoming call dialog
	 */
	const answerCall = () => {
		setHasActiveCall(true);

		const peer = new SimplePeer({
			initiator: false,
			trickle: false,
			stream: personalStream,
		});

		peer.on('signal', (payload) => {
			socket.current.emit('acceptCall', {
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

	const declineCall = () => {
		socket.current.emit('decline call', {
			to: activeContactId,
			reason: 'declined',
		});

		setShowPendingCallDialog((state) => false);
		setContactSignal(null);
	};

	const dropCall = () => {
		if (hasActiveCall) {
			socket.current.emit('drop call', {
				to: activeContactId,
				reason: 'cancelled',
			});
			setHasActiveCall(false);
			connectionRef.current.destroy();
		}
	};

	/**
	 * initiate socket whenever activeContactId changes
	 */
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
			});
	}, [token, id, setPersonalStream, socket]);

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

	useEffect(() => {
		fetchToken().then((data) => {
			Device.setup(data.token, { tokenRefreshMs: 30000 });
		});

		Device.on('incoming', (call) => {
			call.accept();

			setHasActiveCall(true);
			setCallStatus('Call in progress');
		});

		Device.on('disconnect', (call) => {
			setHasIncomingCall(false);
			setHasActiveCall(false);
			setCallData(null);
			setCallStatus('Call Completed');
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

	const acceptIncomingCall = (callData, response) => {
		sendCallResponse(callData, response);

		navigate(`/home/phone/${callData.from}/`);
	};

	const rejectIncomingCall = (callData, response) => {
		sendCallResponse(callData, response);

		if (incomingCallCountRef.current > 1) {
			return;
		}

		setHasIncomingCall(false);
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
				rejectIncomingCall(payload, 'reject');
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

		activeSocket.on('initiateCall', initiateCallListener);

		const declineCallHandler = (payload) => {
			if (showPendingCallDialog) {
				setShowPendingCallDialog(false);
				setShowCancelCallDialog(true);
				setCancelReason(payload.reason);
				connectionRef.current.destroy();
			}
		};
		activeSocket.on('decline call', declineCallHandler);

		/**
		 * Handler for contact initiated drop call
		 *
		 *  */
		const dropCallHandler = (payload) => {
			if (hasActiveCall) {
				setShowCancelCallDialog(true);
				setCancelReason(payload.reason);
				setHasActiveCall(false);
				connectionRef.current.destroy();
			}
		};

		activeSocket.on('drop call', dropCallHandler);

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
			activeSocket.off('drop call', dropCallHandler);
			activeSocket.off('decline call', declineCallHandler);
			activeSocket.off('initiateCall', initiateCallListener);
			activeSocket.off('incoming call', incomingPhoneCallListener);
			activeSocket.off('incoming phone call', incomingPhoneCallListener);
			activeSocket.off('disconnect', socketDisconnectedListener);
		};
	});

	return (
		<div className='chat-page-container d-flex flex-row '>
			{showPendingCallDialog && (
				<IncomingVideoCallDialog callHandlers={{ answerCall, declineCall }} />
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
					<VideoChat
						declineCallHandler={declineCall}
						dropCallHandler={dropCall}
					/>
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
						rejectIncomingCall={rejectIncomingCall}
						acceptIncomingCall={acceptIncomingCall}
						callStatus={callStatus}
						setCallStatus={setCallStatus}
						device={Device}
						isSelfMountedRef={isPhoneMountedRef}
					/>
				</PhoneCall>
			)}
			{hasIncomingCall && !isPhoneMountedRef.current && (
				<IncomingPhoneCallDialog
					callData={callData}
					rejectIncomingCall={rejectIncomingCall}
					acceptIncomingCall={acceptIncomingCall}
				/>
			)}
		</div>
	);
}
