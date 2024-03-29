import { useContext, useEffect, useRef, useState } from 'react';
import { ReactSVG } from 'react-svg';
import UserContext from '../contexts/UserContext';
import Loader from '../utils/Loader';
import SearchResultItem from './SearchResultItem';
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
				setIsLoading(false);

				if (result.status === 'FAILED') {
					console.error(result.message);
					return;
				}

				setResultsTable(() =>
					result.data.map((user) => (
						<SearchResultItem
							key={uuid()}
							user={user}
						/>
					))
				);

				setShowTable(true);
			})
			.catch((err) => {
				setIsLoading(false);
				console.error(err);
			});
	};

	/**
	 * @description: Tasked to attach a listener to the body element
	 * when the results table is showing
	 *
	 * Its job it to figure out if the user clicks
	 * outside of the table or search box and hide the table if the user does
	 */
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
					maxLength='60'
					required
					ref={searchRef}
					onClick={(e) => e.target.select()}
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
			{showTable && (
				<table
					className='results-table'
					ref={tableRef}
				>
					<tbody className='results-list'>{resultsTable}</tbody>
				</table>
			)}
		</div>
	);
}
