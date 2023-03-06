import React, { useEffect, useContext } from 'react';
import UserContext from '../UserContext';
import Contact from '../components/Contacts';
import ChatWindow from '../components/ChatWindow';
import { useNavigate } from 'react-router-dom';

// import useWebSocket from 'react-use-websocket';

export default function Chat() {
	const { socket, token, id } = useContext(UserContext);
	const navigate = useNavigate();

	useEffect(() => {
		socket.emit('connect socket', { id });

		if (!token) {
			navigate('/');
		}
	}, []);

	return (
		<div className='chat-page-container d-flex flex-row '>
			<Contact />
			<ChatWindow activeChat='maria' />
		</div>
	);
}
