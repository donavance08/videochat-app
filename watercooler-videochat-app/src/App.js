import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import { useRef, useState } from 'react';
import LandingPage from './pages/LandingPage';
import AppNavBar from './components/AppNavBar';
import Home from './pages/Home';
import ErrorPage from './pages/ErrorPage';
import useLocalStorage from './customHooks.js/useLocalStorage';
import { ToastContainer, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
	const [token, setToken, clearToken] = useLocalStorage('token', '');
	const [name, setName, clearName] = useLocalStorage('name', '');
	const [id, setId, clearId] = useLocalStorage('id', '');
	const [personalStream, setPersonalStream] = useState();
	const [contactStream, setContactStream] = useState();
	const [showPendingCallDialog, setShowPendingCallDialog] = useState();
	const [hasActiveCall, setHasActiveCall] = useState();
	const [callInitiator, setCallInitiator] = useState();
	const [showCancelCallDialog, setShowCancelCallDialog] = useState();
	const [isContactUpdated, setIsContactUpdated] = useState();

	const connectionRef = useRef();

	const socket = useRef();

	const clearLocalStorage = () => {
		clearToken();
		clearName();
		clearId();
	};

	const resetContextValues = () => {
		setPersonalStream(null);
		setContactStream(null);
		setShowPendingCallDialog(false);
		setHasActiveCall(false);
		setShowCancelCallDialog(false);
		clearLocalStorage();
		socket?.current.disconnect();
		connectionRef.current = null;
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
					setPersonalStream,
					personalStream,
					contactStream,
					setContactStream,
					showPendingCallDialog,
					setShowPendingCallDialog,
					hasActiveCall,
					setHasActiveCall,
					callInitiator,
					setCallInitiator,
					showCancelCallDialog,
					setShowCancelCallDialog,
					connectionRef,
					resetContextValues,
					isContactUpdated,
					setIsContactUpdated,
				}}
			>
				<ToastContainer
					position='bottom-right'
					autoClose={5000}
					hideProgressBar={false}
					newestOnTop={false}
					limit={10}
					closeOnClick={false}
					rtl={false}
					pauseOnFocusLoss
					draggable={false}
					transition={Zoom}
					pauseOnHover
					theme='colored'
				/>
				<BrowserRouter>
					<AppNavBar />
					<Routes>
						<Route
							path='/'
							element={
								token ? <Navigate to='/home' /> : <Navigate to='/login' />
							}
						/>
						<Route
							path='/home'
							element={token ? <Home /> : <Navigate to='/login' />}
						/>
						<Route
							path='/login'
							element={<LandingPage component='login' />}
						/>

						<Route
							path='/registration'
							element={<LandingPage component='register' />}
						/>
						<Route
							path='/home/video-chat'
							element={<Home component='videoChat' />}
						/>
						<Route
							path='/home/chat'
							element={<Home component='chat' />}
						/>
						<Route
							path='/home/sms'
							element={<Home component='sms' />}
						/>
						<Route
							path='*'
							element={<ErrorPage />}
						/>
						<Route
							path='/home/phone/:phoneNumber'
							element={<Home component='phone' />}
						/>
						<Route
							path='/home/phone/'
							element={<Home component='phone' />}
						/>
					</Routes>
				</BrowserRouter>
			</UserProvider>
		</div>
	);
}

export default App;

