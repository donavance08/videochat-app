import { ReactSVG } from 'react-svg';

export default function VideoChatControl() {
	return (
		<div className='video-chat-control-container'>
			<div className='hstack gap-2 call-buttons-container'>
				<button className='call-control small-button'>
					<ReactSVG
						className='call-control-svg'
						src='/icons/muted-button.svg'
					/>
				</button>
				<button className='call-control large-button'>
					<ReactSVG
						className='call-control-large-svg'
						src='/icons/end-call-button.svg'
					/>
				</button>
				<button className='call-control small-button'>
					<ReactSVG
						className='call-control-svg'
						src='/icons/camera-off-button.svg'
					/>
				</button>
			</div>
		</div>
	);
}
