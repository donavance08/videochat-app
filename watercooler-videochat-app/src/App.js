import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import AppNavBar from './components/AppNavBar';
import { useSelector } from 'react-redux';
import './App.css';

function App() {
	const { token } = useSelector((state) => state.token);

	return (
		<div className='App'>
			<BrowserRouter>
				<AppNavBar />
				<Routes>
					<Route
						path='/'
						element={token ? <Home /> : <Navigate to='/users/login' />}
					/>
					<Route
						path='/users/login'
						element={<LandingPage component='login' />}
					/>

					<Route
						path='/users/'
						element={<LandingPage component='register' />}
					/>
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;

