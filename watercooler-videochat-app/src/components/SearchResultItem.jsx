import { v4 as uuid } from 'uuid';
import Avatar from 'react-avatar';
import { ReactSVG } from 'react-svg';

export default function SearchResultItem({ user }) {
	const handleClick = () => {};

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
