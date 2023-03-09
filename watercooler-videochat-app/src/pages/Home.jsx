import React, { useEffect, useContext, useState, useRef } from 'react';
import UserContext from '../UserContext';
import Contacts from '../components/Contacts';
import ChatHistory from '../components/ChatHistory';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { setMessage } from '../redux/chat';
import VideoChat from '../components/VideoChat';
import Peer from 'simple-peer';

export default function Chat({ component }) {
	const { socket, token, id, name } = useContext(UserContext);
	const { activeContactId, activeContactName } = useSelector(
		(state) => state.chat
	);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [personalStream, setPersonalStream] = useState();
	const [contactStream, setContactStream] = useState();
	const [recievingCall, setReceivingCall] = useState();
	const [contactId, setContactId] = useState();
	const [contactName, setContactName] = useState();
	const [contactSignal, setContactSignal] = useState();
	const [callAccepted, setCallAccepted] = useState();
	const [idToCall, setIdToCall] = useState();
	const [callEnded, setCallEnded] = useState();

	// const personalVideo = useRef();
	// const contactVideo = useRef();
	const connectionRef = useRef();

	useEffect(() => {
		navigator.mediaDevices
			.getUserMedia({ video: true, audio: true })
			.then((stream) => {
				setPersonalStream(stream);
			});

		socket.current = io(`${process.env.REACT_APP_API_URL}`, {
			extraHeaders: {
				id,
			},
		});
		socket.current.on('connection', (payload) => {
			console.log(payload);
		});

		socket.current.on('initiateCall', (payload) => {
			setReceivingCall(true);
			setContactId(payload.caller);
			setContactName(payload.name);
			setContactSignal(payload.signal);
		});

		if (!token) {
			navigate('/');
		}
	}, []);

	// effect for handling incoming chat messages
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

	// const initiateCall = (id) => {
	// 	const peer = new Peer({
	// 		initiator: true,
	// 		trickle: false,
	// 		stream: personalStream,
	// 	});

	// 	peer.on('signal', (payload) => {
	// 		socket.emit('initiateCall', {
	// 			callee: id,
	// 			signalData: payload,
	// 			caller: id,
	// 			name,
	// 		});
	// 	});

	// 	peer.on('stream', (stream) => {
	// 		setContactStream(stream);
	// 	});

	// 	socket.on('acceptCall', (signal) => {
	// 		setCallAccepted(true);
	// 		peer.signal(signal);
	// 	});

	// 	connectionRef.current = peer;
	// };

	// const answerCall = () => {
	// 	setCallAccepted(true);

	// 	const peer = new Peer({
	// 		initiator: false,
	// 		trickle: false,
	// 		stream: personalStream,
	// 	});

	// 	peer.on('signal', (payload) => {
	// 		socket.current.emit('acceptCall', { signal: payload, to: contactId });
	// 	});

	// 	peer.signal(contactSignal);
	// 	connectionRef.current = peer;
	// };

	// const leaveCall = () => {
	// 	setCallEnded(true);
	// 	connectionRef.current.destroy();
	// };

	return (
		<div className='chat-page-container d-flex flex-row '>
			<Contacts />
			{component === 'chat' ? (
				<ChatHistory />
			) : (
				<VideoChat personalVideoSrc={personalStream} />
			)}
		</div>
	);
}
