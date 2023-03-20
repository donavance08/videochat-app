import { useRef, useState, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ReactSVG } from 'react-svg';
import { setMessage } from '../redux/chat';
import UserContext from '../UserContext';
import Loader from '../utils/Loader';

export default function UploadFile() {
	const inputFileRef = useRef();
	const [isLoading, setIsLoading] = useState(false);
	const { activeContactId } = useSelector((state) => state.chat);
	const { token } = useContext(UserContext);
	const dispatch = useDispatch();

	const handleClick = () => {
		inputFileRef.current.click();
	};

	const handleChange = (event) => {
		const formData = new FormData();
		formData.append('file', inputFileRef.current.files[0]);

		setIsLoading(() => true);
		fetch(
			`${process.env.REACT_APP_API_URL}/api/chat/upload/${activeContactId}`,
			{
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`,
				},
				body: formData,
			}
		)
			.then((response) => response.json())
			.then((result) => {
				if (result.status === 'OK') {
					dispatch(setMessage({ isOwner: true, image: result.data.filename }));
				}

				setIsLoading(() => false);
			})
			.catch((err) => {
				console.error(err);
				setIsLoading(() => false);
			});
	};

	return (
		<div className='input-button'>
			{isLoading ? (
				<Loader size='small' />
			) : (
				<button
					title='Upload Image'
					onClick={() => handleClick()}
					className='input-button'
				>
					<ReactSVG
						className='input-button-svg'
						src='/icons/upload-button.svg'
					/>
				</button>
			)}

			<input
				id='file-upload-input'
				type='file'
				name='file'
				encType='multipart/form-data'
				accept='image/*'
				ref={inputFileRef}
				onChange={handleChange}
				style={{ display: 'none' }}
			/>
		</div>
	);
}
