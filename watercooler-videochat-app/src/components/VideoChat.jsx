import { useEffect, useRef } from 'react';

export default function VideoChat({ contactVideoSrc, personalVideoSrc }) {
	const personalVideo = useRef();
	const contactVideoRef = useRef();

	useEffect(() => {
		// personalVideo.current.srcObject = personalVideoSrc;
	}, []);
	return (
		<div className='video-chat-container col-6'>
			<div className='personal-video-container'>
				<video
					ref={personalVideo}
					muted
					autoPlay
				></video>
			</div>
			<div className='contact-video-container'>
				<video ref={contactVideoRef}></video>
			</div>
		</div>
	);
}
