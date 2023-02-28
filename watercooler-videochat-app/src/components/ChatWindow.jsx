import React from 'react';
import { useSelector } from 'react-redux';

export default function ChatWindow() {
	const { activeContact } = useSelector((state) => state.chat);

	return (
		<div className='chat-body-container col-6'>
			<div className='chat-header'>{activeContact.nickname}</div>
			<div className='chat-history-container'>chat history</div>
			<div className='chat-input'>chat input</div>
		</div>
	);
}
