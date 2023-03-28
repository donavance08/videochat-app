import { useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import UserContext from '../contexts/UserContext';

export default function CancelCallDialog({ cancelReason }) {
	const { prevActiveContactName } = useSelector((state) => state.chat);
	const { setShowCancelCallDialog } = useContext(UserContext);

	useEffect(() => {
		setTimeout(() => {
			setShowCancelCallDialog(false);
		}, 3000);
	});

	return (
		<div className='pending-call-container'>
			<div className='vstack pending-call-box'>
				<div className='pending-call-display'>
					<h2 className='pendingcall-header'>{prevActiveContactName}</h2>
					{cancelReason === 'cancelled' && <h3>Call disconnected</h3>}
					{cancelReason === 'declined' && <h3>Call declined</h3>}
					{cancelReason === 'offline' && <h3>Offline</h3>}
				</div>
			</div>
		</div>
	);
}
