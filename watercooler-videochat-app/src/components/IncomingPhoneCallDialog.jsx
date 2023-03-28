import { ReactSVG } from 'react-svg';

export default function IncomingPhoneCallDialog({
	callData,
	setIncomingCall,
	callResponseHandler,
}) {
	return (
		<div className='incoming-call-dialog-container'>
			<p>Incoming call from</p>
			<span>{callData.from}</span>
			<div>
				<button
					className='answer-btn'
					onClick={() => callResponseHandler(callData, 'accept')}
				>
					<ReactSVG
						className='call-control-large-svg'
						src='/icons/calling-button.svg'
					/>
				</button>
				<button
					className='decline-btn'
					onClick={() => callResponseHandler(callData, 'reject')}
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
