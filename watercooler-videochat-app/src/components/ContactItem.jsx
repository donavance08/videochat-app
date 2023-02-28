import React from 'react';
import { useDispatch } from 'react-redux';
import { setActiveContact } from '../redux/chat';

export default function ContactItem({ data }) {
	const dispatch = useDispatch();

	function handleClick() {
		dispatch(setActiveContact(data));
	}
	return (
		<div className='contact-item-container'>
			<button onClick={() => handleClick()}>{data.nickname}</button>
		</div>
	);
}
