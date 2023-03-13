import { useContext, useEffect, useRef } from 'react';
import UserContext from '../UserContext';

export default function UserVideo() {
	const { personalStream } = useContext(UserContext);
	const personalVideo = useRef();

	useEffect(() => {
		personalVideo.current.srcObject = personalStream;
	}, [personalStream]);

	return (
		<div className='personal-video-container'>
			<video
				ref={personalVideo}
				autoPlay
			></video>
		</div>
	);
}
