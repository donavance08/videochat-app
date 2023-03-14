import { useContext } from 'react';
import { useSelector } from 'react-redux';
import VideoChatControl from './VideoChatControl';
import ContactVideo from './ContactVideo';
import UserContext from '../UserContext';

const SimplePeer = require('simple-peer');

export default function VideoChat({ declineCallHandler, dropCallHandler }) {
	const { activeContactName, activeContactId } = useSelector(
		(state) => state.chat
	);
	const {
		personalStream,
		setContactStream,
		setShowPendingCallDialog,
		setCallInitiator,
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

		setShowPendingCallDialog(true);
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
			console.log('recieved an accept call response');
			try {
				setCallOngoing(true);
				setShowPendingCallDialog(false);
				peer.signal(signal);
			} catch (err) {
				console.log(err);
			}
		});

		socket.current.on('decline call', (payload) => {
			console.log('trigger from initatecall');
			if (payload.from === activeContactId) {
				setShowPendingCallDialog(false);
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
				dropCallHandler={dropCallHandler}
			/>
		</div>
	);
}
