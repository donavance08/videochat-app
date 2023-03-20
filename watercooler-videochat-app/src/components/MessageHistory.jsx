import { useState, useContext, useRef, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import UserContext from '../UserContext';
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

		const listener = (payload) => {
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
		console.log('activeSocket', activeSocket);
		return () => {
			activeSocket.off('receive msg', listener);
		};
	}, [activeContactId, dispatch, activeComponent, socket]);

	const fetchData = useCallback(() => {
		console.time('fetch');
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
				console.timeEnd('fetch');
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
