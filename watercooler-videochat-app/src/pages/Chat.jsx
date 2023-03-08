import React, { useEffect, useContext, useState } from 'react';
import UserContext from '../UserContext';
import Contact from '../components/Contacts';
import ChatHistory from '../components/ChatHistory';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { setMessage } from '../redux/chat';

export default function Chat() {
	const { socket, token, id } = useContext(UserContext);
	const { activeContactId } = useSelector((state) => state.chat);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	useEffect(() => {
		socket.current = io(`${process.env.REACT_APP_API_URL}`);
		socket.current.emit('connect socket', { id });

		if (!token) {
			navigate('/');
		}
	}, []);

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
			<Contact />
			<ChatHistory />
		</div>
	);
}
