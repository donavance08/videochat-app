import { useContext } from 'react';
import { ReactSVG } from 'react-svg';
import UserContext from '../UserContext';

export default function IncomingPhoneCallDialog() {
	const { setCallOngoing } = useContext(UserContext);
	const answerCall = () => {
		setCallOngoing(true);
	};

	const declineCall = () => {};

	return (
		<div className='incoming-call-dialog-container'>
			<p>
				Incoming call from <p>Nick</p>
			</p>
			<div>
				<button
					className='answer-btn'
					onClick={answerCall}
				>
					<ReactSVG
						className='call-control-large-svg'
						src='/icons/calling-button.svg'
					/>
				</button>
				<button
					className='decline-btn'
					onClick={declineCall}
				>
					<ReactSVG
						className='call-control-large-svg'
						src='/icons/end-call-button.svg'
					/>
				</button>
			</div>
		</div>
	);
}
