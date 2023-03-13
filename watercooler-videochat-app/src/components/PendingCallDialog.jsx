import { useContext } from 'react';
import { useSelector } from 'react-redux';
import { ReactSVG } from 'react-svg';
import UserContext from '../UserContext';

export default function PendingCallDialog(props) {
	const {
		callHandlers: { answerCall, declineCall },
	} = props;

	const { activeContactName } = useSelector((state) => state.chat);
	const {
		setPersonalStream,
		setShowCallDialog,
		setCallOngoing,
		callOngoing,
		callInitiator,
	} = useContext(UserContext);

	const acceptCall = () => {
		setShowCallDialog(false);

		answerCall();
		setCallOngoing(true);
		console.log('callOngoing', callOngoing);
	};

	return (
		<div className='pending-call-container'>
			<div className='vstack pending-call-box'>
				<div className='pending-call-display'>
					<h2>{callInitiator ? 'Calling' : 'Incoming call from'} </h2>
					<h2 className='pendingcall-header'>{activeContactName}</h2>
				</div>
				<div className='hstack incoming-call-controls'>
					<button
						className='accept-button incoming-call-btn'
						onClick={declineCall}
					>
						<ReactSVG
							className='call-control-large-svg'
							src='/icons/end-call-button.svg'
						/>
					</button>
					{callInitiator ? (
						<></>
					) : (
						<button
							className='accept-button incoming-call-btn'
							onClick={acceptCall}
						>
							<ReactSVG
								className='call-control-large-svg'
								src='/icons/calling-button.svg'
							/>
						</button>
					)}
				</div>
			</div>
		</div>
	);
}
