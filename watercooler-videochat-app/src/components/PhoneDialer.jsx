import { useState, useEffect, useRef, useContext, useCallback } from 'react';
import { setActiveContactPhoneNumber } from '../redux/chat';
import { useDispatch, useSelector } from 'react-redux';
import { ReactSVG } from 'react-svg';
import { toast } from 'react-toastify';
import { v4 as uuid } from 'uuid';
import UserContext from '../contexts/UserContext';

export default function PhoneDialer({
	callStatus,
	setCallStatus,
	device,
	callData,
}) {
	const { callOngoing, setCallOngoing, token, socket } =
		useContext(UserContext);
	const { activeContactPhoneNumber } = useSelector((state) => state.chat);
	const [phoneNumber, setPhoneNumber] = useState('');
	const [keypad, setKeypad] = useState();
	const dispatch = useDispatch();
	const inputRef = useRef();
	const inputLabelRef = useRef();

	const handleDelete = () => {
		if (callStatus === 'Calling') {
			return;
		}

		if (phoneNumber.length > 0) {
			setPhoneNumber((state) => state.slice(0, state.length - 1));
		}
	};

	const handleCallButton = async (event) => {
		if (!phoneNumber) {
			return;
		}

		setCallStatus('Dialing');
		setCallOngoing(true);
		dispatch(setActiveContactPhoneNumber(''));

		device.connect({
			To: phoneNumber,
			token: `Bearer ${token}`,
		});
	};

	const endCall = () => {
		if (callOngoing) {
			device.disconnectAll();
			setCallOngoing(false);
		}
	};

	const handleClick = useCallback(
		(key) => {
			if (callOngoing) {
				return;
			}
			if (phoneNumber.length <= 12) {
				setPhoneNumber((state) => state + key);
			}
		},
		[phoneNumber, callOngoing]
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
		const activeSocket = socket?.current;

		if (!activeSocket) {
			return;
		}

		const callDeclinedListener = (payload) => {
			setCallStatus(payload.status);
		};

		activeSocket.on('call declined', callDeclinedListener);

		const callCompleteListener = (payload) => {
			setCallStatus(payload.status);

			if (payload.status === 'Call Completed') {
				setPhoneNumber('');
			}
		};

		activeSocket.on('call status', callCompleteListener);

		const invalidNumberListener = (payload) => {
			toast.error('Invalid Phone number');
		};

		activeSocket.on('invalid phoneNumber', invalidNumberListener);
	}, [socket, setCallStatus]);

	useEffect(() => {
		if (callData) {
			setPhoneNumber(callData.from);
		}

		if (activeContactPhoneNumber) {
			setPhoneNumber(activeContactPhoneNumber);
		}
	});

	return (
		<div className='phone-keypad-container'>
			<label
				htmlFor='phone'
				ref={inputLabelRef}
				value={callStatus}
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
