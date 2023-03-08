import { useDispatch } from 'react-redux';
import { setActiveContactId, setActiveContactName } from '../redux/chat';

export default function ContactItem({ data }) {
	const dispatch = useDispatch();

	function handleClick(event) {
		dispatch(setActiveContactId(data._id));
		dispatch(setActiveContactName(data.nickname));
	}

	return (
		<div className='contact-item-container'>
			<button onClick={(e) => handleClick(e)}>{data.nickname}</button>
		</div>
	);
}
