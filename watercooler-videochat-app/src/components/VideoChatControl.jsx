import { useContext, useEffect, useRef, useState } from 'react';
import { ReactSVG } from 'react-svg';
import UserContext from '../UserContext';
import RecordControl from './RecordControl';

export default function VideoChatControl({
	initiateCall,
	declineCallHandler: declineCall,
	dropCallHandler,
}) {
	const [offVideo, setOffVideo] = useState(false);
	const [recording, setRecording] = useState(false);
	const { callOngoing, setMuted, muted, contactStream } =
		useContext(UserContext);
	const [recordedChunks, setRecordedChunks] = useState([]);
	const mediaRecorder = useRef();

	const downloadRecordedVideo = () => {
		console.log(mediaRecorder.current.mimeType);
		const blob = new Blob(recordedChunks, {
			type: 'video/webm',
		});

		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		document.body.appendChild(a);
		a.style = 'display: none';
		a.href = url;
		a.download = 'recording.webm';
		a.click();
		console.log('video downloaded');
	};

	const handleRecord = () => {
		const vp9Codec = 'video/webm; codex=vp=9';
		const vp9Options = { mimeType: vp9Codec };

		if (MediaRecorder.isTypeSupported(vp9Codec)) {
			mediaRecorder.current = new MediaRecorder(contactStream, vp9Options);
		} else {
			mediaRecorder.current = new MediaRecorder(contactStream);
		}

		mediaRecorder.current.ondataavailable = (event) => {
			if (event.data.size > 0) {
				setRecordedChunks((recordedChunks) => [...recordedChunks, event.data]);
				downloadRecordedVideo();
			}
		};

		console.log(mediaRecorder.current);
		mediaRecorder.current.start();
		setRecording(true);
	};

	const stopRecording = () => {
		console.log('stop recording');
		setRecording(false);
		mediaRecorder.current.stop();
	};

	/* Ensure that RecordControl hides if a user drops the call while recording */
	useEffect(() => {
		setRecording(false);
	}, [callOngoing]);

	return (
		<div className='video-chat-control-container'>
			<div className='hstack gap-2 call-buttons-container'>
				{!recording ? (
					<button
						className='call-control small-button'
						onClick={(e) => handleRecord()}
					>
						<ReactSVG
							className='call-control-svg'
							src='/icons/record.svg'
						/>
					</button>
				) : (
					<RecordControl functions={[stopRecording]} />
				)}
				{muted ? (
					<button
						className='call-control small-button'
						onClick={() => setMuted((state) => !state)}
					>
						<ReactSVG
							className='call-control-svg'
							src='/icons/unmuted-button.svg'
						/>
					</button>
				) : (
					<button
						className='call-control small-button'
						onClick={() => setMuted((state) => !state)}
					>
						<ReactSVG
							className='call-control-svg'
							src='/icons/muted-button.svg'
						/>
					</button>
				)}

				{callOngoing ? (
					<button
						className='call-control large-end-button'
						onClick={dropCallHandler}
					>
						<ReactSVG
							className='call-control-large-svg'
							src='/icons/end-call-button.svg'
						/>
					</button>
				) : (
					<button
						className='call-control large-calling-button'
						onClick={initiateCall}
					>
						<ReactSVG
							className='call-control-large-svg'
							src='/icons/calling-button.svg'
						/>
					</button>
				)}

				{offVideo ? (
					<button
						className='call-control small-button'
						onClick={(e) => setOffVideo((state) => !state)}
					>
						<ReactSVG
							className='call-control-svg'
							src='/icons/camera-off-button.svg'
						/>
					</button>
				) : (
					<button
						className='call-control small-button'
						onClick={(e) => setOffVideo((state) => !state)}
					>
						<ReactSVG
							className='call-control-svg'
							src='/icons/camera-on-button.svg'
						/>
					</button>
				)}
			</div>
		</div>
	);
}
