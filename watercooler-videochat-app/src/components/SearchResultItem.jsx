import { v4 as uuid } from 'uuid';
import Avatar from 'react-avatar';
import { ReactSVG } from 'react-svg';
import { useContext, useState } from 'react';
import UserContext from '../contexts/UserContext';

export default function SearchResultItem({ user }) {
	const [isLoading, setIsLoading] = useState();
	const { token, setIsContactUpdated } = useContext(UserContext);

	const handleClick = () => {
		setIsLoading(true);

		fetch(`${process.env.REACT_APP_API_URL}/api/users/contacts/${user._id}`, {
			method: 'PUT',
			headers: {
				'Content-type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		})
			.then((response) => response.json())

			.then((result) => {
				if (result.status === 'OK') {
					setIsContactUpdated(true);
				} else {
					console.error(result.message);
				}

				setIsLoading(false);
			})

			.catch((err) => {
				console.error(err.message);
				setIsLoading(false);
			});
	};

	return (
		<tr key={uuid()}>
			<td className='results-data'>
				<div className='search-results-avatar'>
					<Avatar
						name={`${user.nickname}`}
						maxInitials={2}
						size={'40px'}
						round={true}
					/>
				</div>
				<div className='search-results-name'>{user.nickname}</div>
				<div className='search-results-add-container'>
					<button onClick={handleClick}>
						<ReactSVG src='./icons/add.svg' />
					</button>
				</div>
			</td>
		</tr>
	);
}
