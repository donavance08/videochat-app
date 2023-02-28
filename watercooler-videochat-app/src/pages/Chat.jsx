import React, { useEffect } from 'react';
import Contact from '../components/Contacts';
import ChatWindow from '../components/ChatWindow';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function Chat() {
	const { token } = useSelector((state) => state.user);
	const navigate = useNavigate();

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
