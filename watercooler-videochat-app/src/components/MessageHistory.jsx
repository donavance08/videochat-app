import { useState, useContext, useRef, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import UserContext from '../contexts/UserContext';
import MessageSnippet from './MessageSnippet';
import { v4 as uuid } from 'uuid';
import { clearMessages, setArrayOfMessages, setMessage } from '../redux/chat';
import Loader from '../utils/Loader';

export default function MessageHistory({ activeComponent }) {
	const { messages, activeContactId } = useSelector((state) => state.chat);
	const { token, id, socket } = useContext(UserContext);
	const [messageWidget, setMessageWidget] = useState();
	const dispatch = useDispatch();
	const bottomRef = useRef();
	const [isLoading, setIsLoading] = useState();
	const [isError, setIsError] = useState(false);

	useEffect(() => {
		setMessageWidget(
			messages.map((message) => {
				return (
					<MessageSnippet
						bottom={bottomRef}
						key={uuid()}
						value={message}
					/>
				);
			})
		);
	}, [messages]);

	/**
	 * handles listener for incoming chat messages
	 *
	 */
	useEffect(() => {
		const activeSocket = socket.current;

		if (!activeSocket) {
			return;
		}

		const incomingMessageListener = (payload) => {
			const from = payload.data.sender;
			if (
				payload.data.header !== activeComponent ||
				!(from === id || from === activeContactId)
			) {
				return;
			}

			const isOwner = from === id;

			if (payload?.data.filename) {
				dispatch(setMessage({ isOwner, image: payload.data.filename }));
				return;
			}

			dispatch(setMessage({ isOwner, message: payload.data.message }));
		};

		activeSocket.on('receive msg', incomingMessageListener);

		return () => {
			activeSocket.off('receive msg', incomingMessageListener);
		};
	}, [activeContactId, dispatch, activeComponent, socket, id]);

	const fetchData = useCallback(() => {
		setIsError(false);
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
				if (result?.status === 'OK') {
					dispatch(setArrayOfMessages({ data: result.data, userId: id }));
				} else {
					setIsError(true);
				}
				setIsLoading(false);
			})
			.catch((err) => {
				console.log(err);
			});
	}, [activeContactId, activeComponent, token, id, dispatch]);

	useEffect(() => {
		setIsLoading(true);
		dispatch(clearMessages());
		fetchData();
	}, [fetchData, dispatch]);

	const retryFetchData = useCallback(() => {
		setIsLoading(true);
		setIsError(false);
		fetchData();
	}, [fetchData, setIsError]);

	return (
		<div className='chat-history-container'>
			{isLoading ? (
				<Loader size='big' />
			) : (
				<>
					{isError && (
						<div className='placeholder-div'>
							<p>
								We seem to have encountered an Error.{' '}
								<button
									className='try-again-btn'
									onClick={retryFetchData}
								>
									{' '}
									Try again?
								</button>
							</p>
						</div>
					)}
					{!isError && messages.length === 0 ? (
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
	);
}
