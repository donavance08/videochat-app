import React, { useRef, useContext, useState, useEffect } from 'react';
import { ReactSVG } from 'react-svg';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { useSelector, useDispatch } from 'react-redux';
import { setMessage, deleteLastMessage } from '../redux/chat';
import UserContext from '../UserContext';
import UploadFile from '../components/UploadFile';

export default function ChatInput({ activeComponent }) {
	const { token } = useContext(UserContext);
	const [showEmojis, setShowEmojis] = useState(false);
	const { activeContactId } = useSelector((state) => state.chat);
	const emojiModalRef = useRef();
	const inputMessageRef = useRef();
	const emojiButtonRef = useRef();
	const dispatch = useDispatch();

	// function to handle clicking of submit button || On enter
	const handleSubmit = (event) => {
		event.preventDefault();

		if (!inputMessageRef.current.value) {
			return;
		}

		dispatch(
			setMessage({ isOwner: true, message: inputMessageRef.current.value })
		);

		fetch(
			`${process.env.REACT_APP_API_URL}/api/${activeComponent}/${activeContactId}`,
			{
				method: 'POST',
				headers: {
					'content-type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					message: inputMessageRef.current.value,
					header: activeComponent,
				}),
			}
		)
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
	};

	// Used to automatically hide emoji window when clicking anywhere outside of it
	useEffect(() => {
		document.body.addEventListener('click', onClickOutside);
		return () => document.body.removeEventListener('click', onClickOutside);
	}, []);

	const onClickOutside = async (e) => {
		const element = e.target;
		if (
			emojiModalRef.current &&
			!emojiModalRef.current.contains(element) &&
			!emojiButtonRef.current.contains(element)
		) {
			e.preventDefault();
			e.stopPropagation();
			await setShowEmojis(false);
		}
	};

	async function handleShowEmojiWindow(e) {
		await setShowEmojis(true);
	}

	async function handleEmojiSelect(e) {
		let emojiString = e.unified.split('-');
		emojiString = emojiString.map((string) => {
			return '0x' + string;
		});
		const emoji = String.fromCodePoint(...emojiString);
		inputMessageRef.current.value = inputMessageRef.current.value + emoji;
		await setShowEmojis(false);
	}

	return (
		<div className='input-container'>
			{activeComponent === 'chat' && (
				<>
					<button
						title='Insert Emoji'
						className='emoji-button input-button'
						ref={emojiButtonRef}
						onClick={(e) => handleShowEmojiWindow(e)}
					>
						<ReactSVG
							className='input-button-svg'
							src='/icons/emoji-button.svg'
						/>
					</button>
					{showEmojis && (
						<div ref={emojiModalRef}>
							<Picker
								className='emoji-expand'
								data={data}
								onEmojiSelect={(e) => handleEmojiSelect(e)}
							/>
						</div>
					)}
				</>
			)}
			{activeComponent === 'chat' && <UploadFile />}
			<div className='chat-input'>
				<form onSubmit={handleSubmit}>
					<input
						id='new-msg-input'
						type='text'
						placeholder='Enter a message'
						ref={inputMessageRef}
					/>
					<button
						type='submit'
						className='input-button'
					>
						<ReactSVG
							className='input-button-svg'
							src='/icons/send-button.svg'
						/>
					</button>
				</form>
			</div>
		</div>
	);
}
