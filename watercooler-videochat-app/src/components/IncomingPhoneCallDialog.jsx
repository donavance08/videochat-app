import { ReactSVG } from 'react-svg';

export default function IncomingPhoneCallDialog({
	callData,
	rejectIncomingPhoneCall,
	acceptIncomingPhoneCall,
}) {
	return (
		<div className='incoming-call-dialog-container'>
			<p>Incoming call from</p>
			<span>{callData.from}</span>
			<div>
				<button
					className='answer-btn'
					onClick={() => acceptIncomingPhoneCall(callData, 'accept')}
				>
					<ReactSVG
						className='call-control-large-svg'
						src='/icons/calling-button.svg'
					/>
				</button>
				<button
					className='decline-btn'
					onClick={() => rejectIncomingPhoneCall(callData, 'reject')}
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
