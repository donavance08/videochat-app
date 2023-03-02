import React, { useEffect, useContext } from 'react';
import UserContext from '../UserContext';
import Contact from '../components/Contacts';
import ChatWindow from '../components/ChatWindow';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setMessage } from '../redux/chat';

// import useWebSocket from 'react-use-websocket';

export default function Chat() {
	const { socket } = useContext(UserContext);
	const { token, id } = useSelector((state) => state.user);
	const { messages } = useSelector((state) => state.user);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		socket.emit('connect socket', { id });
	}, []);

	useEffect(() => {
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
