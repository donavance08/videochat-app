import { useContext, useState } from 'react';
import { ReactSVG } from 'react-svg';
import UserContext from '../UserContext';

export default function ToggleVideoEnabledButton() {
	const [videoDisabled, setVideoDisabled] = useState(false);
	const { personalStream } = useContext(UserContext);

	/**
	 *  function to disable video property of the personal video stream
	 *  will modify videoDisabled state to help render the correct buttons
	 * */
	const handleVideoDisableClick = () => {
		personalStream.getVideoTracks()[0].enabled =
			!personalStream.getVideoTracks()[0].enabled;
		setVideoDisabled((state) => !state);
	};

	return (
		<>
			{videoDisabled ? (
				<button
					className='call-control small-button'
					onClick={handleVideoDisableClick}
				>
					<ReactSVG
						className='call-control-svg'
						src='/icons/camera-off-button.svg'
					/>
				</button>
			) : (
				<button
					className='call-control small-button'
					onClick={handleVideoDisableClick}
				>
					<ReactSVG
						className='call-control-svg'
						src='/icons/camera-on-button.svg'
					/>
				</button>
			)}
		</>
	);
}