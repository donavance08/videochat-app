import React, { useContext, useEffect, useState } from 'react';
import UserContext from '../UserContext';
import ContactItem from './ContactItem';

export default function Contact() {
	const { token } = useContext(UserContext);
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
			})
			.catch((err) => console.log(err.message));
	}, []);

	return (
		<div className='contacts-container col-3 border border-dark'>
			<div className='contacts-header-container'>
				<h2>Contacts</h2>
				<hr />
			</div>

			{contacts}
			<div className='avatar-container'></div>
		</div>
	);
}
