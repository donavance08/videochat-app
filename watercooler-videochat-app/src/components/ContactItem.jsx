import { useRef, useState } from 'react';
import {
	setActiveContactId,
	setActiveContactName,
	setActiveContactPhoneNumber,
} from '../redux/chat';
import { useDispatch } from 'react-redux';
import { customAlphabet } from 'nanoid';
import { ReactSVG } from 'react-svg';
import { useNavigate } from 'react-router-dom';
/***
 * This component handles the options that appears when user click on a contact
 * */

const alphabet =
	'0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const nanoid = customAlphabet(alphabet, 10);

const generateValidElementId = () => {
	let tempId;
	while (true) {
		tempId = nanoid();

		if (tempId && isNaN(tempId.split('')[0])) {
			break;
		}
	}

	return tempId;
};

export default function ContactItem({ data }) {
	const [isContactSelected, setIsContactSelected] = useState();
	const dispatch = useDispatch();
	const optionsRef = useRef();
	const contactRef = useRef();

	const navigate = useNavigate();

	const randomElementId = generateValidElementId();

	// function to handle user click on a contact
	const handleContactClick = (event) => {
		dispatch(setActiveContactId(data._id));
		dispatch(setActiveContactName(data.nickname));
		dispatch(setActiveContactPhoneNumber(data.phoneNumber));
		document.body.addEventListener('click', onClickOutside);
		setIsContactSelected((state) => !state);
	};

	const handleOptionsClick = ({ route }) => {
		dispatch(setActiveContactId(data._id));
		dispatch(setActiveContactName(data.nickname));

		navigate(`/home/${route}`);
	};

	// function to handle hiding chat and video call buttons after click even triggered
	const onClickOutside = (e) => {
		const element = e.target;

		if (
			contactRef.current &&
			!contactRef.current.contains(element) &&
			!optionsRef.current.contains(element)
		) {
			e.preventDefault();
			e.stopPropagation();
			setIsContactSelected(false);
			document.body.removeEventListener('click', onClickOutside);
		}
	};

	return (
		<div className='contact-item-container'>
			<button
				ref={contactRef}
				onClick={(e) => handleContactClick(e)}
			>
				{data.nickname}
			</button>
			{isContactSelected ? (
				<div
					className='hstack gap-1 contact-options-container'
					ref={optionsRef}
					id={randomElementId}
				>
					<button
						className='contact-options-button'
						title='Chat'
					>
						<ReactSVG
							className='input-button-svg'
							src='/icons/chat-button.svg'
							onClick={() => handleOptionsClick({ route: 'chat' })}
						/>
					</button>
					<button
						className='contact-options-button'
						title='Video chat'
					>
						<ReactSVG
							className='input-button-svg'
							src='/icons/video-chat-button.svg'
							onClick={() => handleOptionsClick({ route: 'video-chat' })}
						/>
					</button>
					<button
						className='contact-options-button'
						title='SMS'
					>
						<ReactSVG
							className='input-button-svg'
							src='/icons/sms.svg'
							onClick={() => handleOptionsClick({ route: 'sms' })}
						/>
					</button>
					<button
						className='contact-options-button'
						title='Phone'
					>
						<ReactSVG
							className='input-button-svg'
							src='/icons/phone.svg'
							onClick={() => handleOptionsClick({ route: 'phone' })}
						/>
					</button>
				</div>
			) : (
				<>
					<div
						className='hstack gap-1'
						ref={optionsRef}
						id={randomElementId}
					></div>
				</>
			)}
		</div>
	);
}
