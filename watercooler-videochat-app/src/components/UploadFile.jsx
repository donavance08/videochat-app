import { useRef, useState } from 'react';
import { ReactSVG } from 'react-svg';
import Loader from '../utils/Loader';

export default function UploadFile() {
	const inputFileRef = useRef();
	const [isLoading, setIsLoading] = useState(false);

	const handleClick = () => {
		inputFileRef.current.click();
	};

	const handleChange = (event) => {
		event.preventDefault();

		const formData = new FormData();
		formData.append('file', inputFileRef.current.files[0]);

		setIsLoading(() => true);
		fetch(`${process.env.REACT_APP_API_URL}/api/messages/upload`, {
			method: 'POST',
			body: formData,
		})
			.then((response) => response.json())
			.then((result) => {
				console.log(result);
				setIsLoading(() => false);
			})
			.catch((err) => {
				console.err(err);
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
