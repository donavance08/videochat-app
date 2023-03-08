import React, { useRef, useContext, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import UserContext from '../UserContext';
import { v4 as uuid } from 'uuid';
import MessageItem from './MessageItem';
import Loader from '../utils/Loader';
import ChatInput from './ChatInput';
import {
	clearMessages,
	setArrayOfMessages,
	changeLoadingStatus,
} from '../redux/chat';

export default function ChatHistory() {
	const { activeContactName, messages, isLoading, activeContactId } =
		useSelector((state) => state.chat);
	const { token, id } = useContext(UserContext);
	const [messageWidget, setMessageWidget] = useState();
	const dispatch = useDispatch();
	const bottomRef = useRef();

	useEffect(() => {
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
							bottom={bottomRef}
							key={key}
							value={message}
						/>
					);
				})
			);
		}
	}, [messages]);

	useEffect(() => {
		if (!activeContactId) {
			return;
		}

		dispatch(changeLoadingStatus(true));
		dispatch(clearMessages());
		fetch(`${process.env.REACT_APP_API_URL}/api/messages/${activeContactId}`, {
			headers: {
				'content-type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		})
			.then((response) => response.json())
			.then((result) => {
				if (result && result.data.length > 0) {
					dispatch(setArrayOfMessages({ data: result.data, userId: id }));
				}
				dispatch(changeLoadingStatus(false));
			})
			.catch((err) => {
				console.log(err);
			});
	}, [activeContactName]);

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
						{isLoading ? <Loader size='big' /> : messageWidget}
						<div ref={bottomRef}></div>
					</div>
					<ChatInput />
				</>
			)}
		</div>
	);
}
