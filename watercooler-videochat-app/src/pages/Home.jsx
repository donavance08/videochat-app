import React, { useEffect, useContext, useState, useCallback } from 'react';
import UserContext from '../UserContext';
import Contacts from '../components/Contacts';
import ChatHistory from '../components/ChatHistory';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { setMessage } from '../redux/chat';
import VideoChat from '../components/VideoChat';
import PendingCallDialog from '../components/PendingCallDialog';
import CancelCallDialog from '../components/CancelCallDialog';
import { setActiveContactId, setActiveContactName } from '../redux/chat';
const SimplePeer = require('simple-peer');

export default function Chat({ component }) {
	console.log('home render');
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
		callInitiator,
		setCallInitiator,
		showCancelCallDialog,
		setShowCancelCallDialog,
		connectionRef,
		setPersonalStream,
	} = useContext(UserContext);
	const { activeContactId, prevActiveContactName, prevActiveContactId } =
		useSelector((state) => state.chat);

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
		console.log('initialzing socket');
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
	}, []);

	/**
	 * socket will listen for incoming video chat
	 * also redirect back to login if user is not yet logged in
	 */
	useEffect(() => {
		if (!token) {
			navigate('/');
		}

		socket.current.on('disconnect', (payload) => {
			console.log('socket disconnected');
			console.log('socket current', socket.current);
		});

		const initiateCallListener = (payload) => {
			console.log('recieved a call ');

			if (callOngoing) {
				return;
			}

			setShowPendingCallDialog(true);
			setCallInitiator(false);
			dispatch(setActiveContactId(payload.from));
			dispatch(setActiveContactName(payload.name));
			setContactSignal(payload.signal);
		};

		socket.current.on('initiateCall', initiateCallListener);

		const declineCallHandler = (payload) => {
			console.log('trigger decline call handler');
			if (showPendingCallDialog) {
				setShowPendingCallDialog(false);
				setShowCancelCallDialog(true);
				setCancelReason(payload.reason);
				connectionRef.current.destroy();
			}
		};
		socket.current.on('decline call', declineCallHandler);

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

		socket.current.on('drop call', dropCallHandler);

		const userDisconnectHandler = ({ id }) => {
			if (callOngoing && activeContactId === id) {
				setShowCancelCallDialog(true);
				setCancelReason('cancelled');
				connectionRef.current.destroy();
				setCallOngoing(false);
			}
		};

		socket.current.on('user disconnect', userDisconnectHandler);
		return () => {
			socket.current.off('user disconnect', userDisconnectHandler);
			socket.current.off('drop call', dropCallHandler);
			socket.current.off('decline call', declineCallHandler);
		};
	});

	/**
	 * handles listener for incoming chat messages
	 *
	 */
	useEffect(() => {
		const listener = (payload) => {
			if (payload.sender !== activeContactId) {
				return;
			}

			if (payload?.filename) {
				dispatch(setMessage({ isOwner: false, image: payload.filename }));
			}
			dispatch(setMessage({ isOwner: false, message: payload.message }));
		};

		socket.current.on('receive msg', listener);

		return () => {
			socket.current.off('receive msg', listener);
		};
	}, [activeContactId]);

	return (
		<div className='chat-page-container d-flex flex-row '>
			{showPendingCallDialog && (
				<PendingCallDialog callHandlers={{ answerCall, declineCall }} />
			)}
			{showCancelCallDialog && <CancelCallDialog cancelReason={cancelReason} />}
			<Contacts />
			{component === 'chat' ? (
				<ChatHistory />
			) : (
				<VideoChat
					declineCallHandler={declineCall}
					dropCallHandler={dropCall}
				/>
			)}
		</div>
	);
}
