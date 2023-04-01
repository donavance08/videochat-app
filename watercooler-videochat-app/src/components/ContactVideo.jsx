import { useContext, useEffect, useRef } from 'react';
import UserContext from '../contexts/UserContext';
import UserVideo from './UserVideo.jsx';

export default function ContactVideo() {
	const { contactStream, hasActiveCall } = useContext(UserContext);
	const contactVideoRef = useRef();

	useEffect(() => {
		if (contactVideoRef.current) {
			contactVideoRef.current.srcObject = contactStream;
		}
	}, [contactStream]);

	return (
		<div className='contact-video-container'>
			{hasActiveCall && (
				<div>
					<div className='user-video-container'>
						<UserVideo />
					</div>
					<video
						className='contact-video'
						ref={contactVideoRef}
						autoPlay
					></video>
				</div>
			)}
		</div>
	);
}
