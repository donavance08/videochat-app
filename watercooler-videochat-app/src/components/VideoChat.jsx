import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import VideoChatControl from './VideoChatControl';

export default function VideoChat({ contactVideoSrc, personalVideoSrc }) {
	const { activeContactName } = useSelector((state) => state.chat);
	const personalVideo = useRef();
	const contactVideoRef = useRef();

	useEffect(() => {
		personalVideo.current.srcObject = personalVideoSrc;
	}, []);

	return (
		<div className='video-chat-container col-6'>
			<div className='chat-header'>{activeContactName}</div>
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
			<VideoChatControl />
		</div>
	);
}
