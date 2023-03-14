import { useContext, useState } from 'react';
import { ReactSVG } from 'react-svg';
import UserContext from '../UserContext';

export default function RecordControls({ functions }) {
	const [stopRecording] = functions;
	const [recorderPause, setRecorderPaused] = useState();
	const { contactStream } = useContext(UserContext);

	const pauseRecording = () => {
		setRecorderPaused((paused) => !paused);
	};

	return (
		<div className='recording-control-container'>
			<div className='recording-control-box'>
				{recorderPause ? (
					<button onClick={pauseRecording}>
						<ReactSVG
							className='call-control-svg'
							src='/icons/play.svg'
						/>
					</button>
				) : (
					<button onClick={pauseRecording}>
						<ReactSVG
							className='call-control-svg'
							src='/icons/pause.svg'
						/>
					</button>
				)}
				<button onClick={stopRecording}>
					<ReactSVG
						className='call-control-svg'
						src='/icons/stop.svg'
					/>
				</button>
			</div>
		</div>
	);
}
