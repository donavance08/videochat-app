import { useEffect, useState } from 'react';
import { ReactSVG } from 'react-svg';

export default function RecordControls({ setRecording }) {
	const [paused, setPaused] = useState();

	const pauseRecording = () => {
		setPaused((paused) => !paused);
	};

	useEffect(() => {
		console.log(paused);
	});

	return (
		<div className='recording-control-container'>
			<div className='recording-control-box'>
				{paused ? (
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
				<button onClick={() => setRecording(false)}>
					<ReactSVG
						className='call-control-svg'
						src='/icons/stop.svg'
					/>
				</button>
			</div>
		</div>
	);
}
