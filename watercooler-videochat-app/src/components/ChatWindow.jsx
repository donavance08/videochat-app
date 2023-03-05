import React, { useRef, useContext, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setMessage } from '../redux/chat';
import UserContext from '../UserContext';
import { v4 as uuid } from 'uuid';
import MessageItem from './MessageItem';
import Loader from '../utils/Loader';
import ChatInput from './ChatInput';

export default function ChatWindow() {
	const { activeContactName, messages, isLoading } = useSelector(
		(state) => state.chat
	);
	const { socket } = useContext(UserContext);
	const [messageWidget, setMessageWidget] = useState();

	const dispatch = useDispatch();
	const bottomRef = useRef();

	useEffect(() => {
		const listener = (payload) => {
			console.log('recieved message', payload);
			dispatch(setMessage({ isOwner: false, message: payload.message }));
		};

		socket.on('receive msg', listener);

		if (messages.length === 0) {
			setMessageWidget(
				<div className='placeholder-div'>
					<p>Start a conversation by sending a message</p>
				</div>
			);
		} else {
			setMessageWidget(
				messages.map((message) => {
					const key = uuid();

					return (
						<MessageItem
							key={key}
							value={message}
						/>
					);
				})
			);
		}

		return () => {
			socket.off('receive msg', listener);
		};
	}, [messages]);

	useEffect(() => {
		bottomRef.current?.scrollIntoView();
	});
	return (
		<div className='chat-body-container col-6'>
			{!activeContactName ? (
				<>
					<div className='empty-conversation-container'>
						<p>Select a contact to start conversation</p>
					</div>
				</>
			) : (
				<>
					<div className='chat-header'>{activeContactName}</div>
					<div className='chat-history-container'>
						{isLoading ? <Loader /> : messageWidget}
						<div ref={bottomRef}></div>
					</div>
					<ChatInput />
				</>
			)}
		</div>
	);
}
