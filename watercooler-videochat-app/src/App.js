import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './UserContext';
import { useState } from 'react';
import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import AppNavBar from './components/AppNavBar';
import Chat from './pages/Chat';
import { useSelector } from 'react-redux';
import './App.css';

import Avatar from './components/Avatar';

function App() {
	const { token } = useSelector((state) => state.user);
	const [socket, setSocket] = useState();

	return (
		<div className='App'>
			<UserProvider value={{ socket, setSocket }}>
				<BrowserRouter>
					<AppNavBar />
					<Routes>
						<Route
							path='/'
							element={token ? <Chat /> : <Navigate to='/users/login' />}
						/>
						<Route
							path='/chat'
							element={token ? <Chat /> : <Navigate to='/users/login' />}
						/>
						<Route
							path='/users/login'
							element={<LandingPage component='login' />}
						/>

						<Route
							path='/users/'
							element={<LandingPage component='register' />}
						/>
						<Route
							path='/avatar'
							element={<Avatar />}
						/>
					</Routes>
				</BrowserRouter>
			</UserProvider>
		</div>
	);
}

export default App;

