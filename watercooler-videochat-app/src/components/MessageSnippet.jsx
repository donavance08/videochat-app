import { useContext, useEffect, useState } from 'react';
import UserContext from '../contexts/UserContext';
import { useSelector } from 'react-redux';
import Loader from '../utils/Loader';

export default function MessageSnippet({ value, bottomRef }) {
	const { isOwner, message, image } = value;
	const { activeContactName } = useSelector((state) => state.chat);
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
				bottomRef.current?.scrollIntoView();
			});
		}
	}, [message, token]);

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
				<div className='msg-snippet-container'>
					<h5>{isOwner ? 'You' : activeContactName}</h5>
					<div className='text-container'>
						<p className='message-item-paragraph'>{message}</p>
					</div>
				</div>
			)}
		</div>
	);
}
