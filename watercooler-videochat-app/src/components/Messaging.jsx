import { useSelector } from 'react-redux';
import ChatInput from './ChatInput';
import MessageHistory from './MessageHistory';

export default function Messaging({ activeComponent, column }) {
	const { activeContactName } = useSelector((state) => state.chat);
	const col = parseInt(column);

	console.log(col <= 3);

	return (
		<div className={`chat-body-container col-${column}`}>
			{!activeContactName ? (
				<>
					<div className='empty-conversation-container'>
						<p>Select a contact to start conversation</p>
					</div>
				</>
			) : (
				<>
					{!(col <= 3) && (
						<div className='chat-header'>{activeContactName}</div>
					)}
					<MessageHistory activeComponent={activeComponent} />
					<ChatInput activeComponent={activeComponent} />
				</>
			)}
		</div>
	);
}
