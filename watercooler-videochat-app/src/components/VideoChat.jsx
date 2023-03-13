import { useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import VideoChatControl from './VideoChatControl';
import ContactVideo from './ContactVideo';
import UserContext from '../UserContext';
import { connect } from 'mongoose';
const SimplePeer = require('simple-peer');

export default function VideoChat({ declineCallHandler }) {
	const { activeContactName, activeContactId } = useSelector(
		(state) => state.chat
	);
	const {
		setPersonalStream,
		personalStream,
		setContactStream,
		setShowCallDialog,
		setCallInitiator,
		callOngoing,
		setCallOngoing,
		connectionRef,
	} = useContext(UserContext);
	const { socket, name, id } = useContext(UserContext);

	const initiateCall = () => {
		const peer = new SimplePeer({
			initiator: true,
			trickle: false,
			stream: personalStream,
		});

		setShowCallDialog(true);
		setCallInitiator(true);

		peer.on('signal', (payload) => {
			socket.current.emit('initiateCall', {
				to: activeContactId,
				signal: payload,
				from: id,
				name,
			});
		});

		peer.on('stream', (stream) => {
			setContactStream(stream);
		});

		socket.current.on('acceptCall', (signal) => {
			try {
				setCallOngoing(true);
				setShowCallDialog(false);
				peer.signal(signal);
			} catch (err) {
				console.error(err);
			}
		});

		socket.current.on('declineCall', (payload) => {
			if (payload.from === activeContactId) {
				setShowCallDialog(false);
				console.log('Call was declined');
			}
		});

		connectionRef.current = peer;
	};

	return (
		<div className='video-chat-container col-6'>
			<div className='chat-header'>{activeContactName}</div>
			{/* {callOngoing && <ContactVideo />} */}
			<ContactVideo />
			<VideoChatControl
				initiateCall={initiateCall}
				declineCallHandler={declineCallHandler}
			/>
		</div>
	);
}
