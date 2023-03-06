import React from 'react';

import { useNavigate } from 'react-router-dom';
import Loader from '../utils/Loader';

export default function Home() {
	const navigate = useNavigate();
	function handleClick() {
		navigate('/chat');
	}
	return (
		<>
			<h1>This is HOME</h1>
			<Loader size='big' />
			<button onClick={() => handleClick()}>go to chat</button>
		</>
	);
}
