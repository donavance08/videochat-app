import { useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import UserContext from '../UserContext';

export default function CancelCallDialog({ cancelReason }) {
	const { prevActiveContactName } = useSelector((state) => state.chat);
	const { setShowCancelCallDialog } = useContext(UserContext);

	useEffect(() => {
		setTimeout(() => {
			setShowCancelCallDialog(false);
		}, 5000);
	});

	return (
		<div className='pending-call-container'>
			<div className='vstack pending-call-box'>
				<div className='pending-call-display'>
					<h2 className='pendingcall-header'>{prevActiveContactName}</h2>
					{cancelReason === 'cancelled' ? (
						<h2>Call disconnected</h2>
					) : (
						<h2>Call declined</h2>
					)}
				</div>
			</div>
		</div>
	);
}
