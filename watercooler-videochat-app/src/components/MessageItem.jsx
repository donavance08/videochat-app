export default function MessageItem({ value }) {
	const { isOwner, message } = value;
	const cssClassName = isOwner ? 'right-message' : 'left-message';

	return (
		<div className={`${cssClassName} message-item-container`}>
			<div>
				<p className='message-item-paragraph'>{message}</p>
			</div>
		</div>
	);
}
