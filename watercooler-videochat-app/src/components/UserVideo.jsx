import { useContext, useEffect, useRef } from 'react';
import UserContext from '../contexts/UserContext';

export default function UserVideo() {
	const { personalStream } = useContext(UserContext);
	const personalVideo = useRef();

	useEffect(() => {
		if (personalVideo.current) {
			personalVideo.current.srcObject = personalStream;
		}
	}, [personalStream]);

	return (
		<div className='personal-video-container'>
			<video
				id='personal-video'
				ref={personalVideo}
				autoPlay
			></video>
		</div>
	);
}
