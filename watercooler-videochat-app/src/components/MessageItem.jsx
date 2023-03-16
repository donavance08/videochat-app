import { useContext, useEffect, useState } from 'react';
import UserContext from '../UserContext';
import Loader from '../utils/Loader';

export default function MessageItem({ value, bottom }) {
	const { isOwner, message, image } = value;
	const { token } = useContext(UserContext);
	const [imageObjectURL, setImageObjectURL] = useState();
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (image) {
			setIsLoading(true);
			fetch(`${process.env.REACT_APP_API_URL}/api/chat/files/${image}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}).then(async (response) => {
				const imageBlob = await response.blob();
				setImageObjectURL(URL.createObjectURL(imageBlob));
				setIsLoading(false);
				bottom.current?.scrollIntoView();
			});
		}
	}, [message]);

	return (
		<div
			className={`${
				isOwner ? 'right-message' : 'left-message'
			} message-item-container`}
		>
			{image ? (
				isLoading ? (
					<Loader size='small' />
				) : (
					<div className='image-container'>
						<img
							className='image'
							src={imageObjectURL}
							alt='Failed'
						/>
					</div>
				)
			) : (
				<div className='text-container'>
					<p className='message-item-paragraph'>{message}</p>
				</div>
			)}
		</div>
	);
}
