import { useState } from 'react';
import { ReactSVG } from 'react-svg';

export default function RecordControls({ functions }) {
	const [stopRecording, pauseRecording, resumeRecording] = functions;
	const [recorderPause, setRecorderPaused] = useState();

	const handlePauseClick = () => {
		pauseRecording();
		setRecorderPaused((paused) => !paused);
	};

	const handleResumeClick = () => {
		resumeRecording();
		setRecorderPaused((paused) => !paused);
	};

	return (
		<div className='recording-control-container'>
			<div className='recording-control-box'>
				{recorderPause ? (
					<button
						onClick={handleResumeClick}
						title='Resume Recording'
					>
						<ReactSVG
							className='call-control-svg'
							src='/icons/play.svg'
						/>
					</button>
				) : (
					<button
						onClick={handlePauseClick}
						title='Pause Recording'
					>
						<ReactSVG
							className='call-control-svg'
							src='/icons/pause.svg'
						/>
					</button>
				)}
				<button
					onClick={stopRecording}
					title='Stop Recording'
				>
					<ReactSVG
						className='call-control-svg'
						src='/icons/stop.svg'
					/>
				</button>
			</div>
		</div>
	);
}
