import React, { useRef } from 'react';
import Login from '../components/Login';
import Registration from '../components/Registration';

export default function LandingPage() {
	return (
		<div className='landing-page-container'>
			{/* <Registration /> */}
			<Login />
		</div>
	);
}
