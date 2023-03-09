import { useRef, useState } from 'react';
import { setActiveContactId, setActiveContactName } from '../redux/chat';
import { useDispatch } from 'react-redux';
import { customAlphabet } from 'nanoid';
import { ReactSVG } from 'react-svg';
import Loader from '../utils/Loader';
import { useNavigate } from 'react-router-dom';
/***
 * This component handles the functions under each item in the contact list
 * */

// options for nanoid
const alphabet =
	'0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const nanoid = customAlphabet(alphabet, 10);

export default function ContactItem({ data }) {
	const dispatch = useDispatch();
	const subButtonsRef = useRef();
	const contactButtonRef = useRef();
	const [contactClick, setContactClick] = useState();
	const navigate = useNavigate();
	const elementId = generateValidElementId();

	// function to handle user click on a contact
	function handleContactClick(event) {
		document.body.addEventListener('click', onClickOutside);
		setContactClick((state) => !state);
	}

	function handleSubButtonClick({ route }) {
		dispatch(setActiveContactId(data._id));
		dispatch(setActiveContactName(data.nickname));

		navigate(`/home/${route}`);
	}

	// create an elementId and make sure it starts with a letter
	function generateValidElementId() {
		let tempId;
		while (true) {
			tempId = nanoid();

			if (tempId && isNaN(tempId.split('')[0])) {
				break;
			}
		}

		return tempId;
	}

	// setup listener to close or hide chat and video chat buttons when user clicks outside of its area
	// useEffect(() => {
	// document.body.addEventListener('click', onClickOutside);
	// return () => document.body.removeEventListener('click', onClickOutside);
	// }, []);

	// function to handle hiding chat and video call buttons after click even triggered
	function onClickOutside(e) {
		const element = e.target;

		if (
			contactButtonRef.current &&
			!contactButtonRef.current.contains(element) &&
			!subButtonsRef.current.contains(element)
		) {
			e.preventDefault();
			e.stopPropagation();
			setContactClick(false);
			document.body.removeEventListener('click', onClickOutside);
		}
	}

	return (
		<div className='contact-item-container'>
			<button
				ref={contactButtonRef}
				onClick={(e) => handleContactClick(e)}
			>
				{data.nickname}
			</button>
			{contactClick ? (
				<div
					className='hstack gap-1'
					ref={subButtonsRef}
					id={elementId}
				>
					<button className='contact-sub-button'>
						<ReactSVG
							className='input-button-svg'
							src='/icons/chat-button.svg'
							loading={() => <Loader size='small' />}
							onClick={() => handleSubButtonClick({ route: 'chat' })}
						/>
					</button>
					<button className='contact-sub-button'>
						<ReactSVG
							className='input-button-svg'
							src='/icons/video-chat-button.svg'
							loading={() => <Loader size='small' />}
							onClick={() => handleSubButtonClick({ route: 'video-chat' })}
						/>
					</button>
				</div>
			) : (
				<>
					<div
						className='hstack gap-1'
						ref={subButtonsRef}
						id={elementId}
					></div>
				</>
			)}
		</div>
	);
}
