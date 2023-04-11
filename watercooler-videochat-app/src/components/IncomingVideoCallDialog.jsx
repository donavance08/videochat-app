import { useContext } from 'react';
import { useSelector } from 'react-redux';
import { ReactSVG } from 'react-svg';
import UserContext from '../contexts/UserContext';

export default function IncomingVideoCallDialog(props) {
	const {
		callHandlers: { answerVideoCallHandler, declineVideoCallHandler },
	} = props;

	const { activeContactName } = useSelector((state) => state.chat);
	const { setShowPendingCallDialog, setHasActiveCall, callInitiator } =
		useContext(UserContext);

	const acceptCall = () => {
		setShowPendingCallDialog(false);

		answerVideoCallHandler();
		setHasActiveCall(true);
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
						onClick={declineVideoCallHandler}
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
