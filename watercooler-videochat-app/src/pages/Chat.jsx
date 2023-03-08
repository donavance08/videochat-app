import React, { useEffect, useContext, useState } from 'react';
import UserContext from '../UserContext';
import Contact from '../components/Contacts';
import ChatHistory from '../components/ChatHistory';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { setMessage } from '../redux/chat';

export default function Chat() {
	const { socket, token, id } = useContext(UserContext);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	useEffect(() => {
		socket.current = io(`${process.env.REACT_APP_API_URL}`);
		socket.current.emit('connect socket', { id });

		const listener = (payload) => {
			if (payload?.filename) {
				dispatch(setMessage({ isOwner: false, image: payload.filename }));
			}
			dispatch(setMessage({ isOwner: false, message: payload.message }));
		};

		socket.current.on('receive msg', listener);

		if (!token) {
			navigate('/');
		}

		return () => {
			socket.current.off('receive msg', listener);
		};
	}, []);

	return (
		<div className='chat-page-container d-flex flex-row '>
			<Contact />
			<ChatHistory />
		</div>
	);
}
