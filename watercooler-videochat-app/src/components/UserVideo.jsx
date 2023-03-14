import { useContext, useEffect, useRef } from 'react';
import UserContext from '../UserContext';

export default function UserVideo() {
	const { personalStream, muted } = useContext(UserContext);
	const personalVideo = useRef();

	useEffect(() => {
		if (personalVideo.current) {
			personalVideo.current.srcObject = personalStream;
		}
	}, [personalStream, muted]);

	useEffect(() => {
		if (muted) {
			personalStream.getAudioTracks()[0].enabled = false;
			return;
		}
		personalStream.getAudioTracks()[0].enabled = true;
	}, [muted]);

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
