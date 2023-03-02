export default function MessageItem({ value }) {
	const { ownMessage, message } = value;
	const cssClassName = ownMessage ? 'right-message' : 'left-message';

	return (
		<div className={`${cssClassName} message-item-container`}>
			<div>
				<p className='message-item-paragraph'>{message}</p>
			</div>
		</div>
	);
}
