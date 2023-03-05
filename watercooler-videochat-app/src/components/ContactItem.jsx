import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	setActiveContactId,
	setActiveContactName,
	clearMessages,
	setArrayOfMessages,
	changeLoadingStatus,
} from '../redux/chat';

export default function ContactItem({ data }) {
	const { token, id } = useSelector((state) => state.user);
	const dispatch = useDispatch();

	function handleClick(event) {
		event.preventDefault();

		dispatch(setActiveContactId(data._id));
		dispatch(setActiveContactName(data.nickname));
		dispatch(clearMessages());
		dispatch(changeLoadingStatus(true));

		fetch(`${process.env.REACT_APP_API_URL}/api/messages/${data._id}`, {
			headers: {
				'content-type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		})
			.then((response) => response.json())
			.then((result) => {
				if (result && result.data.length > 0) {
					dispatch(setArrayOfMessages({ data: result.data, userId: id }));
				}
				dispatch(changeLoadingStatus(false));
			})
			.catch((err) => {
				console.log(err);
			});
	}
	return (
		<div className='contact-item-container'>
			<button onClick={(e) => handleClick(e)}>{data.nickname}</button>
		</div>
	);
}
