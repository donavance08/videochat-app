import { useSelector } from 'react-redux';
import ChatInput from './ChatInput';
import MessageHistory from './MessageHistory';

export default function Messaging({ activeComponent }) {
	const { activeContactName } = useSelector((state) => state.chat);

	return (
		<div className='chat-body-container col-6'>
			{!activeContactName ? (
				<>
					<div className='empty-conversation-container'>
						<p>Select a contact to start conversation</p>
					</div>
				</>
			) : (
				<>
					<div className='chat-header'>{activeContactName}</div>
					<MessageHistory activeComponent={activeComponent} />
					<ChatInput activeComponent={activeComponent} />
				</>
			)}
		</div>
	);
}
