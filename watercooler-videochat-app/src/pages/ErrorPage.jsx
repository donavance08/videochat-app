import { useNavigate } from 'react-router-dom';

export default function ErrorPage() {
	const navigate = useNavigate();
	const handleClick = () => {
		navigate('/');
	};

	return (
		<>
			<div className='error-page-container'>
				<div className='error-page-msg-container'>
					<h1>404</h1>
					<p>The page you're looking for does not exist</p>
					<button onClick={handleClick}>Back to Home</button>
				</div>
			</div>
		</>
	);
}
