import React, { useEffect, useContext, useState, useCallback } from 'react';
// import { Device } from 'twilio-client';
import UserContext from '../UserContext';
import Contacts from '../components/Contacts';
import Messaging from '../components/Messaging';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import VideoChat from '../components/VideoChat';
import PendingCallDialog from '../components/PendingCallDialog';
import CancelCallDialog from '../components/CancelCallDialog';
import { setActiveContactId, setActiveContactName } from '../redux/chat';
import PhoneCall from '../components/PhoneCall';
import IncomingPhoneCallDialog from '../components/IncomingPhoneCallDialog';
const SimplePeer = require('simple-peer');

export default function Home({ component }) {
	console.log('render home');
	const {
		socket,
		token,
		id,
		personalStream,
		setContactStream,
		showPendingCallDialog,
		setShowPendingCallDialog,
		callOngoing,
		setCallOngoing,
		setCallInitiator,
		showCancelCallDialog,
		setShowCancelCallDialog,
		connectionRef,
		setPersonalStream,
		setCalls,
		setCallToken,
	} = useContext(UserContext);
	const { activeContactId } = useSelector((state) => state.chat);
	const [incomingCall, setIncomingCall] = useState(false);

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [contactSignal, setContactSignal] = useState();
	const [cancelReason, setCancelReason] = useState();

	/**
	 * handler for the answercall button of the incoming call dialog
	 */
	const answerCall = () => {
		setCallOngoing(true);

		console.log('personal Stream', personalStream);
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
		if (callOngoing) {
			socket.current.emit('drop call', {
				to: activeContactId,
				reason: 'cancelled',
			});
			setCallOngoing(false);
			connectionRef.current.destroy();
		}
	};

	/**
	 * initiate socket whenever activeContactId changes
	 */
	useEffect(() => {
		fetch(`${process.env.REACT_APP_API_URL}/api/call/token`)
			.then((response) => response.json())
			.then((result) => {
				if (result.status === 'OK') {
					console.log(result);
					setCallToken(result.data);
					// Device.setup(result.data);
					return;
				}

				console.error(result.message);
			})
			.catch((err) => {
				console.err(err.message);
			});

		if (socket.current) {
			socket.current.connect();
		}
		socket.current = io(`${process.env.REACT_APP_API_URL}`, {
			extraHeaders: {
				id,
			},
			reconnection: true,
			reconnectionAttempts: Infinity,
			reconnectionDelay: 1000,
		});

		navigator.mediaDevices
			.getUserMedia({ video: true, audio: true })
			.then((stream) => {
				setPersonalStream(stream);
			});

		socket.current.on('connection', (payload) => {
			console.log(payload);
		});

		const disconnectListener = (payload) => {
			console.log(`${socket.current} got disconnected`);
			socket.current.connect();
		};

		socket.current.on('disconnect', disconnectListener);

		return () => {
			socket.current.disconnect();
			console.log('component unmount');
		};
	}, []);

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
			console.log(payload.data);
			setIncomingCall(true);
			setCalls((calls) => {
				return [...calls, payload.data];
			});
		};

		activeSocket.on('incoming phone call', incomingPhoneCallListener);

		activeSocket.on('disconnect', (payload) => {
			console.log('socket disconnected');
			console.log('socket current', socket.current);
		});

		const initiateCallListener = (payload) => {
			if (callOngoing) {
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
			console.log('trigger decline call handler');
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
			console.log('call cancelled', payload);

			if (callOngoing) {
				setShowCancelCallDialog(true);
				setCancelReason(payload.reason);
				setCallOngoing(false);
				connectionRef.current.destroy();
			}
		};

		activeSocket.on('drop call', dropCallHandler);

		const userDisconnectHandler = ({ id }) => {
			if (callOngoing && activeContactId === id) {
				setShowCancelCallDialog(true);
				setCancelReason('cancelled');
				connectionRef.current.destroy();
				setCallOngoing(false);
			}
		};

		activeSocket.on('user disconnect', userDisconnectHandler);
		return () => {
			activeSocket.off('user disconnect', userDisconnectHandler);
			activeSocket.off('drop call', dropCallHandler);
			activeSocket.off('decline call', declineCallHandler);
			activeSocket.off('initiateCall', initiateCallListener);
			activeSocket.off('incoming call', incomingPhoneCallListener);
		};
	});

	return (
		<div className='chat-page-container d-flex flex-row '>
			{showPendingCallDialog && (
				<PendingCallDialog callHandlers={{ answerCall, declineCall }} />
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
			{component === 'phone' && <PhoneCall />}
			{incomingCall && (
				<IncomingPhoneCallDialog incomingCallHandler={setIncomingCall} />
			)}
		</div>
	);
}
