import React from 'react';
import { useDispatch } from 'react-redux';
import {
	setActiveContactId,
	setActiveContactName,
	clearMessages,
} from '../redux/chat';

export default function ContactItem({ data }) {
	const dispatch = useDispatch();

	function handleClick() {
		dispatch(setActiveContactId(data._id));
		dispatch(setActiveContactName(data.nickname));
		dispatch(clearMessages());
	}
	return (
		<div className='contact-item-container'>
			<button onClick={() => handleClick()}>{data.nickname}</button>
		</div>
	);
}
