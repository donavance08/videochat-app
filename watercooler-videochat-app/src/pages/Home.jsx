import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function Home() {
	const { token } = useSelector((state) => state.user);
	const navigate = useNavigate();
	function handleClick() {
		navigate('/chat');
	}
	return (
		<>
			<h1>This is HOME</h1>
			<button onClick={() => handleClick()}>go to chat</button>
		</>
	);
}
