import { useState, useEffect, useRef, useContext, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ReactSVG } from 'react-svg';
import { toast } from 'react-toastify';
import { v4 as uuid } from 'uuid';
import UserContext from '../contexts/UserContext';

export default function PhoneDialer({
	callData,
	callResponseHandler,
	callStatus,
	setCallStatus,
}) {
	const { callOngoing, setCallOngoing, token, socket } =
		useContext(UserContext);

	const [phoneNumber, setPhoneNumber] = useState('');

	const [keypad, setKeypad] = useState();
	const [endCallActive, setEndCallActive] = useState(true);
	const inputRef = useRef();
	const inputLabelRef = useRef();
	const navigate = useNavigate();

	const handleDelete = () => {
		if (callStatus === 'Calling') {
			return;
		}

		if (phoneNumber.length > 0) {
			setPhoneNumber((state) => state.slice(0, state.length - 1));
		}
	};

	const handleCallButton = (event) => {
		if (!phoneNumber) {
			return;
		}

		setCallStatus('Dialing');
		setCallOngoing(true);

		fetch(`${process.env.REACT_APP_API_URL}/api/call/${phoneNumber}`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
			.then((response) => response.json())

			.then((result) => {
				if (result.errors?.length > 0) {
					result.errors.forEach((error) => {
						toast.error(error.msg, {});
					});
				} else if (result.status === 'OK') {
					setCallStatus(result.message);
				} else {
					console.error(result.message);
				}
			})

			.catch((err) => {
				console.error(err.message);
			});
	};

	const endCall = () => {
		if (!endCallActive) {
			return;
		}

		setEndCallActive(false);

		if (callOngoing && callData) {
			fetch(`${process.env.REACT_APP_API_URL}/api/call/`);
			callResponseHandler(callData, 'drop');
			navigate('/home/phone/');
		}
	};

	const handleClick = useCallback(
		(key) => {
			if (phoneNumber.length <= 12) {
				setPhoneNumber((state) => state + key);
			}
		},
		[phoneNumber]
	);

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
	}, [handleClick]);

	useEffect(() => {
		inputLabelRef.current.value = callStatus;
	}, [callStatus]);

	useEffect(() => {
		const activeSocket = socket?.current;

		if (!activeSocket) {
			return;
		}

		const callDeclinedListener = (payload) => {
			setCallStatus(payload.status);
			setEndCallActive(true);
		};

		activeSocket.on('call declined', callDeclinedListener);

		return () => {
			activeSocket.off('call declined', callDeclinedListener);
		};
	}, [socket, setCallStatus]);

	return (
		<div className='phone-keypad-container'>
			<label
				htmlFor='phone'
				ref={inputLabelRef}
			>
				{callStatus}
			</label>
			<input
				id='phone-input'
				type='text'
				name='phone'
				contentEditable='false'
				readOnly
				ref={inputRef}
				value={phoneNumber}
			/>
			{keypad}

			<div className='keypad-call-button-container'>
				{callOngoing ? (
					<button
						className='keypad-btn'
						onClick={endCall}
					>
						<ReactSVG src='/icons/end-call-button.svg' />
					</button>
				) : (
					<button
						className='keypad-btn'
						onClick={handleCallButton}
					>
						<ReactSVG src='/icons/calling-button.svg' />
					</button>
				)}
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
