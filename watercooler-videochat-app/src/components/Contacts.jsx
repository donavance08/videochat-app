import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ContactItem from './ContactItem';

export default function Contact() {
	const { token } = useSelector((state) => state.user);
	const [contacts, setContacts] = useState([]);

	useEffect(() => {
		fetch(`${process.env.REACT_APP_API_URL}/api/users/contacts`, {
			headers: {
				'content-type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		})
			.then((response) => response.json())
			.then((result) => {
				if (result.status === 'OK') {
					setContacts(
						result.data.map((contact) => (
							<ContactItem
								key={contact._id}
								data={contact}
							/>
						))
					);
					return;
				}

				console.log(result.message);
			})
			.catch((err) => console.log(err.message));
	}, []);

	return (
		<div className='contacts-container col-3 border border-dark'>
			{contacts}
			<div className='avatar-container'></div>
		</div>
	);
}
