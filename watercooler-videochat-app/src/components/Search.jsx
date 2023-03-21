import { useContext, useEffect, useRef, useState } from 'react';
import { ReactSVG } from 'react-svg';
import UserContext from '../UserContext';
import Loader from '../utils/Loader';
import { v4 as uuid } from 'uuid';

export default function Search() {
	const { token } = useContext(UserContext);
	const [isLoading, setIsLoading] = useState();
	const [resultsTable, setResultsTable] = useState();
	const [showTable, setShowTable] = useState(false);

	const tableRef = useRef();
	const searchRef = useRef();

	const handleSearch = (event) => {
		event.preventDefault();
		setIsLoading(true);
		fetch(
			`${process.env.REACT_APP_API_URL}/api/users/search/${searchRef.current.value}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		)
			.then((response) => response.json())
			.then((result) => {
				if (result.status === 'FAILED') {
					console.error(result.message);
					setIsLoading(false);
					return;
				}

				setResultsTable(() => {
					return (
						<table
							className='results-table'
							ref={tableRef}
						>
							<tbody>
								{result.data.map((user) => {
									return (
										<tr key={uuid()}>
											<td> {user.nickname}</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					);
				});

				setShowTable(true);
				setIsLoading(false);
			})
			.catch((err) => {
				setIsLoading(false);
				console.error(err);
			});
	};

	useEffect(() => {
		const searchBox = document.querySelector('.search-bar-container > form');

		if (!showTable) {
			return;
		}

		const body = document.querySelector('body');

		const listener = (event) => {
			if (
				tableRef.current.contains(event.target) ||
				searchBox.contains(event.target)
			) {
				return;
			}

			tableRef.current = null;
			setShowTable(false);
			body.removeEventListener('click', listener);
		};

		body.addEventListener('click', listener);

		return () => {
			body.removeEventListener('click', listener);
		};
	}, [tableRef, resultsTable, showTable]);

	return (
		<div className='search-bar-container'>
			<form
				className='d-flex'
				id='search-form'
				role='search'
				onSubmit={handleSearch}
			>
				<input
					className='form-control me-2'
					name='search'
					type='search'
					placeholder='Search People or Friends'
					aria-label='Search'
					min-length='1'
					maxlength='60'
					required
					ref={searchRef}
				/>
				{isLoading ? (
					<Loader size='small' />
				) : (
					<button
						className='search-bar-button'
						type='submit'
					>
						<ReactSVG
							className='input-button-svg'
							src='/icons/search.svg'
						/>
					</button>
				)}
			</form>
			{showTable && resultsTable}
		</div>
	);
}
