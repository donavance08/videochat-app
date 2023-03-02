import React, { useRef, useContext, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ReactSVG } from 'react-svg';
import UserContext from '../UserContext';
import { v4 as uuid } from 'uuid';
import MessageItem from './MessageItem';

export default function ChatWindow() {
	const { activeContactName, activeContactId } = useSelector(
		(state) => state.chat
	);
	const { id } = useSelector((state) => state.user);
	const { socket } = useContext(UserContext);
	const composeMessageRef = useRef();
	const bottomRef = useRef();
	const [messages, setMessages] = useState([]);
	const [messageItems, setMessageItems] = useState();

	function callSetMessages(isOwner, message) {
		setMessages([
			...messages,
			{
				ownMessage: isOwner,
				message: message,
			},
		]);
	}

	function handleSubmit(event) {
		event.preventDefault();
		if (!composeMessageRef.current.value) {
			return;
		}

		callSetMessages(true, composeMessageRef.current.value);

		const payload = {
			message: composeMessageRef.current.value,
			sender: id,
			receiver: activeContactId,
		};

		socket.emit('send msg', payload);

		document.querySelector('#new-msg-input').value = '';
	}

	useEffect(() => {
		const listener = (payload) => {
			callSetMessages(false, payload.message);
		};

		socket.on('receive msg', listener);

		setMessageItems(
			messages.map((message) => {
				const componentKey = uuid();

				return (
					<MessageItem
						key={componentKey}
						value={message}
					/>
				);
			})
		);

		return () => {
			socket.off('receive msg', listener);
		};
	}, [messages]);

	// used to auto scroll to bottom of a chat history
	useEffect(() => {
		bottomRef.current?.scrollIntoView();
	});

	return (
		<div className='chat-body-container col-6'>
			{!activeContactName ? (
				<p>Select a contact to start conversation</p>
			) : (
				<>
					<div className='chat-header'>{activeContactName}</div>
					<div className='chat-history-container'>
						{messageItems}
						<div ref={bottomRef} />
					</div>
					<div className='chat-input'>
						<form onSubmit={(e) => handleSubmit(e)}>
							<input
								id='new-msg-input'
								type='text'
								placeholder='Enter a message'
								ref={composeMessageRef}
							/>
							<button type='submit'>
								<ReactSVG
									className='send-button-svg'
									src='/icons/send-button.svg'
								/>
							</button>
						</form>
					</div>
				</>
			)}
		</div>
	);
}
