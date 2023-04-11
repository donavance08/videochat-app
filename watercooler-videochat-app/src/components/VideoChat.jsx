import { useContext } from 'react';
import { useSelector } from 'react-redux';
import VideoChatControl from './VideoChatControl';
import ContactVideo from './ContactVideo';
import UserContext from '../contexts/UserContext';

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
		setHasActiveCall,
		connectionRef,
	} = useContext(UserContext);
	const { socket, name, id } = useContext(UserContext);

	const initiateCall = () => {
		if (!activeContactId) {
			alert('Please select a contact to call first');
			return;
		}
		const peer = new SimplePeer({
			initiator: true,
			trickle: false,
			stream: personalStream,
		});

		setShowPendingCallDialog(true);
		setCallInitiator(true);

		peer.on('signal', (payload) => {
			socket.current.emit('initiate video call', {
				to: activeContactId,
				signal: payload,
				from: id,
				name,
			});
		});

		peer.on('stream', (stream) => {
			setContactStream(stream);
		});

		socket.current.on('accept video call', (signal) => {
			try {
				setHasActiveCall(true);
				setShowPendingCallDialog(false);
				peer.signal(signal);
			} catch (err) {
				console.log(err);
			}
		});

		socket.current.on('decline video call', (payload) => {
			if (payload.from === activeContactId) {
				setShowPendingCallDialog(false);
			}
		});

		connectionRef.current = peer;
	};

	return (
		<div className='video-chat-container col-6'>
			<div className='chat-header'>{activeContactName}</div>
			<ContactVideo />
			<VideoChatControl
				initiateCall={initiateCall}
				declineCallHandler={declineCallHandler}
				dropCallHandler={dropCallHandler}
			/>
		</div>
	);
}
