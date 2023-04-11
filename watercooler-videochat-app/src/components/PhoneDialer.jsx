import React, {
	useState,
	useEffect,
	useRef,
	useContext,
	useCallback,
} from 'react';
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
	acceptIncomingPhoneCall,
	rejectIncomingPhoneCall,
	hasIncomingCall,
	isSelfMountedRef,
}) {
	const { hasActiveCall, setHasActiveCall, token, socket } =
		useContext(UserContext);
	const { activeContactPhoneNumber } = useSelector((state) => state.chat);
	const [phoneNumber, setPhoneNumber] = useState('');
	const [keypad, setKeypad] = useState();
	const dispatch = useDispatch();
	const inputRef = useRef();
	const inputLabelRef = useRef();

	const handleClickDeleteButton = () => {
		if (hasActiveCall || hasIncomingCall) {
			return;
		}

		if (phoneNumber.length > 0) {
			setPhoneNumber((state) => state.slice(0, state.length - 1));
		}
	};

	const handleClickCallButton = async (event) => {
		if (!phoneNumber) {
			return;
		}

		/**
		 *  @param {boolean} hasIncomingCall will determine if clicking
		 * the button will initiate a call or answer an incoming call
		 */
		if (hasIncomingCall) {
			acceptIncomingPhoneCall(callData, 'accept');
		} else {
			setCallStatus('Dialing');

			device.connect({
				To: phoneNumber,
				token: `Bearer ${token}`,
			});
		}

		setHasActiveCall(true);
		dispatch(setActiveContactPhoneNumber(''));
	};

	const handleClickEndButton = () => {
		if (hasActiveCall) {
			device.disconnectAll();
			setHasActiveCall(false);
		}
	};

	/**
	 * Append key to the current phoneNumber value
	 * @param {String} key
	 */
	const handleClickKeypad = useCallback(
		(key) => {
			if (hasActiveCall || hasIncomingCall) {
				return;
			}
			if (phoneNumber.length <= 12) {
				setPhoneNumber((state) => state + key);
			}
		},
		[phoneNumber, hasActiveCall, hasIncomingCall]
	);

	/** Populate the keypad buttons with corresponding key strings */
	useEffect(() => {
		const keypadKeys = [7, 8, 9, 4, 5, 6, 1, 2, 3, '*', 0, '+'];

		setKeypad(
			keypadKeys.map((keypadKey) => (
				<button
					key={uuid()}
					className='keypad-btn'
					onClick={() => handleClickKeypad(keypadKey)}
					title={keypadKey}
				>
					{keypadKey}
				</button>
			))
		);
	}, [handleClickKeypad]);

	/** Initiate socket listeners */
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

		return () => {
			activeSocket.off('call declined', callDeclinedListener);
			activeSocket.off('call status', callCompleteListener);
			activeSocket.off('invalid phoneNumber', invalidNumberListener);
		};
	}, [socket, setCallStatus]);

	/** Set the @var phoneNumber with a supplied value from parent*/
	useEffect(() => {
		if (callData) {
			setPhoneNumber(callData.from);
		}

		if (activeContactPhoneNumber) {
			setPhoneNumber(activeContactPhoneNumber);
		}
	}, [callData, activeContactPhoneNumber]);

	/**
	 * Update @var isSelfMountedRef which lets the parent know if this
	 * component isMounted
	 */
	useEffect(() => {
		isSelfMountedRef.current = true;

		return () => {
			isSelfMountedRef.current = false;
		};
	}, [isSelfMountedRef]);

	const LeftButton = () => {
		if (hasIncomingCall) {
			return (
				<button
					className='keypad-btn'
					onClick={() => acceptIncomingPhoneCall(callData, 'accept')}
					title='Accept Call'
				>
					<ReactSVG src='/icons/calling-button.svg' />
				</button>
			);
		}

		return (
			<button
				className='keypad-btn'
				disabled
			></button>
		);
	};

	const MiddleButton = () => {
		return (
			<button
				className='keypad-btn'
				{...(hasActiveCall
					? {
							onClick: handleClickEndButton,
							title: 'Drop Call',
					  }
					: {})}
				{...(!hasActiveCall &&
					!hasIncomingCall && {
						onClick: handleClickCallButton,
						title: `Call ${phoneNumber}`,
					})}
			>
				{hasActiveCall && <ReactSVG src='/icons/end-call-button.svg' />}
				{!hasIncomingCall && !hasActiveCall && (
					<ReactSVG src='/icons/calling-button.svg' />
				)}
			</button>
		);
	};

	const RightButton = () => {
		return (
			<button
				className='keypad-btn call-interaction-btn'
				{...(hasIncomingCall && {
					onClick: () => rejectIncomingPhoneCall(callData, 'reject'),
					title: 'Reject Call',
				})}
				{...(!hasIncomingCall &&
					!hasActiveCall && {
						onClick: handleClickDeleteButton,
						title: 'Backspace',
					})}
			>
				{hasIncomingCall ? (
					<ReactSVG src='/icons/end-call-button.svg' />
				) : (
					<ReactSVG src='/icons/delete.svg' />
				)}
			</button>
		);
	};

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
				disabled
			/>
			{keypad}

			<div className='keypad-call-button-container'>
				<LeftButton />
				<MiddleButton />
				<RightButton />
			</div>
		</div>
	);
}
