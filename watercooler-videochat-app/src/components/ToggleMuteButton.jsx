import { useContext, useState } from 'react';
import { ReactSVG } from 'react-svg';
import UserContext from '../contexts/UserContext';

export default function ToggleMuteButton() {
	const [muted, setMuted] = useState(false);
	const { personalStream } = useContext(UserContext);

	const handleMuteClick = () => {
		personalStream.getAudioTracks()[0].enabled =
			!personalStream.getAudioTracks()[0].enabled;
		setMuted((state) => !state);
	};

	return (
		<>
			{muted ? (
				<button
					className='call-control small-button'
					title='Mute'
					onClick={handleMuteClick}
				>
					<ReactSVG
						className='call-control-svg'
						src='/icons/muted-button.svg'
					/>
				</button>
			) : (
				<button
					className='call-control small-button'
					title='Unmute'
					onClick={handleMuteClick}
				>
					<ReactSVG
						className='call-control-svg'
						src='/icons/unmuted-button.svg'
					/>
				</button>
			)}
		</>
	);
}
