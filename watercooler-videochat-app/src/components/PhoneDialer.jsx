import { useState, useEffect, useRef, useContext, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ReactSVG } from 'react-svg';
import { v4 as uuid } from 'uuid';
import UserContext from '../contexts/UserContext';

export default function PhoneDialer({ callData, callResponseHandler }) {
	const { phoneNumber = '' } = useParams();
	const { callOngoing, token } = useContext(UserContext);

	const [keypad, setKeypad] = useState();
	const inputRef = useRef();
	const navigate = useNavigate();

	const handleClick = (key) => {
		if (inputRef && inputRef.current.value.length <= 12) {
			inputRef.current.value = inputRef.current.value + key;
		}
	};

	const handleDelete = () => {
		let input = inputRef.current?.value;

		if (input && input.length > 0) {
			inputRef.current.value = input.slice(0, input.length - 1);
		}
	};

	const handleCallButton = (event) => {
		if (callOngoing) {
			callResponseHandler(callData, 'drop');
			navigate('/home/phone/');
		}

		const phoneNumber = inputRef.current.value;

		if (!phoneNumber) {
			return;
		}

		fetch(`${process.env.REACT_APP_API_URL}/api/call/${phoneNumber}`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
			.then((response) => response.json())
			.then((result) => {
				if (result.status === 'FAILED') {
					console.log(result);
					return;
				}
				callOngoing(true);
			})
			.catch((err) => console.error(err.message));
	};

	useEffect(() => {
		const keys = [7, 8, 9, 4, 5, 6, 1, 2, 3, '*', 0, '+'];

		setKeypad(
			keys.map((key) => {
				return (
					<button
						key={uuid()}
						className='keypad-btn'
						onClick={() => handleClick(key)}
					>
						{key}
					</button>
				);
			})
		);
	}, []);

	return (
		<div className='phone-keypad-container'>
			<input
				id='phone-input'
				type='phone'
				contentEditable='false'
				readOnly
				ref={inputRef}
				value={phoneNumber}
			/>
			{keypad}

			<div className='keypad-call-button-container'>
				<button
					className='keypad-btn'
					onClick={handleCallButton}
				>
					{callOngoing ? (
						<ReactSVG src='/icons/end-call-button.svg' />
					) : (
						<ReactSVG src='/icons/calling-button.svg' />
					)}
				</button>
				<button
					className='keypad-btn'
					onClick={handleDelete}
				>
					<ReactSVG src='/icons/delete.svg' />
				</button>
			</div>
		</div>
	);
}
