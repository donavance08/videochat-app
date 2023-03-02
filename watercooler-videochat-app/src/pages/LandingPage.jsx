import Login from '../components/Login';
import Registration from '../components/Registration';

export default function LandingPage({ component }) {
	return (
		<div className='landing-page-container'>
			{component === 'register' ? <Registration /> : <Login />}
		</div>
	);
}
