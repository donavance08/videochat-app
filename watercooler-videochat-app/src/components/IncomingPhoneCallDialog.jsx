import { ReactSVG } from 'react-svg';

export default function IncomingPhoneCallDialog({
	payload,
	callResponseHandler,
}) {
	return (
		<div className='incoming-call-dialog-container'>
			<p>Incoming call from</p>
			<span>{payload.from}</span>
			<div>
				<button
					className='answer-btn'
					onClick={() => callResponseHandler(payload.data.CallSid, true)}
				>
					<ReactSVG
						className='call-control-large-svg'
						src='/icons/calling-button.svg'
					/>
				</button>
				<button
					className='decline-btn'
					onClick={() => callResponseHandler(payload.data.CallSid, false)}
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
