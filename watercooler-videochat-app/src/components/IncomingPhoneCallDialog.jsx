import { ReactSVG } from 'react-svg';

export default function IncomingPhoneCallDialog({
	payload,
	answerCallHandler,
}) {
	const declineCall = () => {};

	console.log(payload);

	return (
		<div className='incoming-call-dialog-container'>
			<p>Incoming call from</p>
			<span>{payload.from}</span>
			<div>
				<button
					className='answer-btn'
					onClick={() => answerCallHandler(payload.data.CallSid)}
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
