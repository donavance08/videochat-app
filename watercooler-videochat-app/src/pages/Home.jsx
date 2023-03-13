import React, { useEffect, useContext, useState, useRef } from 'react';
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
	const {
		socket,
		token,
		id,
		personalStream,
		setContactStream,
		showPendingCallDialog,
		setShowCallDialog,
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

	/**
	 * cancel/decline call handler
	 * if callee declined call, cancel call with reason declined
	 * if call is ongoing and one of the other drops call, then call reason cancelled
	 * if caller cancelled call before callee responded, call reason cancelled
	 */
	const declineCall = () => {
		if (!callInitiator && !callOngoing) {
			socket.current.emit('cancelCall', {
				to: activeContactId,
				reason: 'declined',
			});
		} else {
			socket.current.emit('cancelCall', {
				to: activeContactId,
				reason: 'cancelled',
			});
			if (callOngoing) {
				console.log(connectionRef.current);
				connectionRef.current.destroy();
				setCallOngoing(false);
			}
		}

		setShowCallDialog(false);
		setContactSignal(null);
		setContactStream(null);
	};

	/**
	 * initiate socket whenever activeContactId changes
	 */
	useEffect(() => {
		socket.current = io(`${process.env.REACT_APP_API_URL}`, {
			extraHeaders: {
				id,
			},
		});

		navigator.mediaDevices
			.getUserMedia({ video: true, audio: true })
			.then((stream) => {
				setPersonalStream(stream);
			});
	}, []);

	/**
	 * also redirect back to login if user is not yet logged in
	 * socket will listen for incoming calls
	 */
	useEffect(() => {
		if (!token) {
			navigate('/');
		}

		// socket.current.on('connection', (payload) => {

		// });

		const initiateCallListener = (payload) => {
			console.log('recieved a call');

			if (callOngoing) {
				return;
			}

			setShowCallDialog(true);
			setCallInitiator(false);
			dispatch(setActiveContactId(payload.from));
			dispatch(setActiveContactName(payload.name));
			setContactSignal(payload.signal);
		};

		const cancelCallListener = (payload) => {
			console.log('call cancelled', payload);
			setShowCallDialog(false);
			setShowCancelCallDialog(true);
			setCancelReason(payload);
			setContactStream(null);
			setCallOngoing(false);
			dispatch(setActiveContactId(prevActiveContactId));
			dispatch(setActiveContactName(prevActiveContactName));
		};

		try {
			const io = socket.current;

			io.on('initiateCall', initiateCallListener);
			io.on('cancelCall', cancelCallListener);

			return () => {
				io.off('initiateCall', initiateCallListener);
				io.off('cancelCall', cancelCallListener);
				console.log('listeners turned off');
			};
		} catch (e) {}
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
				<VideoChat declineCallHandler={declineCall} />
			)}
		</div>
	);
}
