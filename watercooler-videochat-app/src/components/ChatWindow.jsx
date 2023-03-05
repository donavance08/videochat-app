import React, { useRef, useContext, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
	setMessage,
	deleteLastMessage,
	changeLoadingStatus,
} from '../redux/chat';
import { ReactSVG } from 'react-svg';
import UserContext from '../UserContext';
import { v4 as uuid } from 'uuid';
import MessageItem from './MessageItem';
import Loader from '../utils/Loader';

export default function ChatWindow() {
	const { activeContactName, activeContactId, messages, isLoading } =
		useSelector((state) => state.chat);
	const { id, token } = useSelector((state) => state.user);
	const { socket } = useContext(UserContext);
	const [messageWidget, setmessageWidget] = useState();
	const dispatch = useDispatch();

	const composeMessageRef = useRef();
	const bottomRef = useRef();

	console.log('render loading state', isLoading);

	function handleSubmit(event) {
		event.preventDefault();

		if (!composeMessageRef.current.value) {
			return;
		}

		dispatch(
			setMessage({ isOwner: true, message: composeMessageRef.current.value })
		);

		fetch(`${process.env.REACT_APP_API_URL}/api/messages`, {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				message: composeMessageRef.current.value,
				sender: id,
				receiver: activeContactId,
			}),
		})
			.then((response) => response.json())
			.then((result) => {
				if (!(result.status === 'OK')) {
					dispatch(deleteLastMessage());
				}
			})
			.catch((err) => {
				console.log(err);
			});

		document.querySelector('#new-msg-input').value = '';
	}

	useEffect(() => {
		const listener = (payload) => {
			dispatch(setMessage({ isOwner: false, message: payload.message }));
		};

		socket.on('receive msg', listener);

		if (messages.length === 0) {
			setmessageWidget(
				<p>Send a message to {activeContactName} start convertion</p>
			);
		} else {
			setmessageWidget(
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
		}

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
