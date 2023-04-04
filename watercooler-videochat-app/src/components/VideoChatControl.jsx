import { useContext, useEffect, useRef, useState } from 'react';
import { ReactSVG } from 'react-svg';
import UserContext from '../contexts/UserContext';
import RecordControl from './RecordControl';
import ToggleVideoEnabledButton from './ToggleVideoEnabledButton';
import ToggleMuteButton from './ToggleMuteButton';

export default function VideoChatControl({
	initiateCall,
	declineCallHandler: declineCall,
	dropCallHandler,
}) {
	const [recording, setRecording] = useState(false);
	const { hasActiveCall, contactStream } = useContext(UserContext);
	let recordedChunks = useRef([]);
	const mediaRecorder = useRef();

	const downloadRecordedVideo = () => {
		const blob = new Blob(recordedChunks.current, {
			type: 'video/webm',
		});

		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		document.body.appendChild(a);
		a.style = 'display: none';
		a.href = url;
		a.download = 'recording.webm';
		a.click();

		window.URL.revokeObjectURL(url);

		recordedChunks.current = [];
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
				recordedChunks.current.push(event.data);
				downloadRecordedVideo();
			}
		};

		mediaRecorder.current.start();
		setRecording(true);
	};

	const stopRecording = () => {
		setRecording(false);
		mediaRecorder.current.stop();
	};

	const pauseRecording = () => {
		mediaRecorder.current.pause();
	};

	const resumeRecording = () => {
		mediaRecorder.current.resume();
	};

	/* Ensure that RecordControl hides if a user drops the call while recording */
	useEffect(() => {
		setRecording(false);
	}, [hasActiveCall]);

	return (
		<div className='video-chat-control-container'>
			<div className='hstack gap-2 call-buttons-container'>
				{!recording ? (
					<button
						className='call-control small-button'
						title='Record Call'
						onClick={(e) => handleRecord()}
					>
						<ReactSVG
							className='call-control-svg'
							src='/icons/record.svg'
						/>
					</button>
				) : (
					<RecordControl
						functions={[stopRecording, pauseRecording, resumeRecording]}
					/>
				)}
				<ToggleMuteButton />
				{hasActiveCall ? (
					<button
						className='call-control large-end-button'
						onClick={dropCallHandler}
						title='End call'
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
						title='Initiate Call'
					>
						<ReactSVG
							className='call-control-large-svg'
							src='/icons/calling-button.svg'
						/>
					</button>
				)}
				<ToggleVideoEnabledButton />
			</div>
		</div>
	);
}
