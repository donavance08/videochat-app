import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './UserContext';
import { useRef } from 'react';
import LandingPage from './pages/LandingPage';
import AppNavBar from './components/AppNavBar';
import Chat from './pages/Chat';
import useLocalStorage from './customHooks.js/useLocalStorage';
import './App.css';

function App() {
	const [token, setToken, clearToken] = useLocalStorage('token', '');
	const [name, setName, clearName] = useLocalStorage('name', '');
	const [id, setId, clearId] = useLocalStorage('id', '');
	const socket = useRef();

	const clearLocalStorage = () => {
		clearToken();
		clearName();
		clearId();
	};

	return (
		<div className='App'>
			<UserProvider
				value={{
					socket,
					token,
					setToken,
					name,
					setName,
					id,
					setId,
					clearLocalStorage,
				}}
			>
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
					</Routes>
				</BrowserRouter>
			</UserProvider>
		</div>
	);
}

export default App;

