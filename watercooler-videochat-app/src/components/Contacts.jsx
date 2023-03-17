import React, { useContext, useEffect, useState } from 'react';
import UserContext from '../UserContext';
import ContactItem from './ContactItem';
import { v4 as uuid } from 'uuid';
import Loader from '../utils/Loader';

export default function Contact() {
	const { token } = useContext(UserContext);
	const [contacts, setContacts] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		setIsLoading(true);
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
								elementId={uuid()}
								key={contact._id}
								data={contact}
							/>
						))
					);
					setIsLoading(false);
				}
			})
			.catch((err) => console.log(err.message));
	}, [token]);

	return (
		<div className='contacts-container col-3 border border-dark'>
			<div className='contacts-header-container'>
				<h2>Contacts</h2>
				<hr />
			</div>
			{isLoading ? <Loader size='small' /> : contacts}

			<div className='avatar-container'></div>
		</div>
	);
}
