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
	setMessage,
} from '../redux/chat';

export default function ChatHistory({ activeComponent }) {
	const {
		activeContactName,
		messages,

		isLoading,
		activeContactId,
	} = useSelector((state) => state.chat);
	const { token, id, socket } = useContext(UserContext);
	const [messageWidget, setMessageWidget] = useState();
	const dispatch = useDispatch();
	const bottomRef = useRef();

	useEffect(() => {
		setMessageWidget(
			messages.map((message) => {
				return (
					<MessageItem
						bottom={bottomRef}
						key={uuid()}
						value={message}
					/>
				);
			})
		);
	}, [messages]);

	useEffect(() => {
		dispatch(changeLoadingStatus(true));
		dispatch(clearMessages());
		fetch(
			`${process.env.REACT_APP_API_URL}/api/${activeComponent}/${activeContactId}`,
			{
				headers: {
					'content-type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			}
		)
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
	}, [activeContactId, activeComponent, token, id, dispatch]);

	/**
	 * handles listener for incoming chat messages
	 *
	 */
	useEffect(() => {
		const activeSocket = socket.current;
		if (!activeSocket) {
			return;
		}
		console.log('socket loaded');
		const listener = (payload) => {
			console.log('payload', payload);
			if (
				payload.header !== activeComponent ||
				payload.sender !== activeContactId
			) {
				return;
			}

			if (payload?.filename) {
				dispatch(setMessage({ isOwner: false, image: payload.filename }));
			}
			dispatch(setMessage({ isOwner: false, message: payload.message }));
		};

		activeSocket.on('receive msg', listener);

		return () => {
			activeSocket.off('receive msg', listener);
			console.log('socket off');
		};
	}, [activeContactId, dispatch, activeComponent, socket]);

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
						{isLoading ? (
							<Loader size='big' />
						) : (
							<>
								{messages.length === 0 ? (
									<div className='placeholder-div'>
										<p>Start a conversation by sending a message</p>
									</div>
								) : (
									<>
										{messageWidget}
										<div ref={bottomRef}></div>
									</>
								)}
							</>
						)}
					</div>
					<ChatInput activeComponent={activeComponent} />
				</>
			)}
		</div>
	);
}
