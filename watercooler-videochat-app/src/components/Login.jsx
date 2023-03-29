import React, { useRef, useEffect, useContext, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import UserContext from '../contexts/UserContext';
import useLocalStorage from '../customHooks.js/useLocalStorage';
import Loader from '../utils/Loader';
import { toast } from 'react-toastify';

// adding localstorage hook and persist with redux

export default function Login() {
	const { token, setToken, setName, setId } = useContext(UserContext);
	const [isLoading, setIsLoading] = useState(false);

	const navigate = useNavigate(Navigate);

	const usernameRef = useRef();
	const passwordRef = useRef();

	const handleSubmit = (event) => {
		event.preventDefault();

		setIsLoading(() => true);
		fetch(`${process.env.REACT_APP_API_URL}/api/users/login`, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json',
			},
			body: JSON.stringify({
				username: usernameRef.current.value,
				password: passwordRef.current.value,
			}),
		})
			.then((response) => response.json())
			.then((result) => {
				if (result.status === 'OK') {
					setToken(() => result.data.token);
					setName(() => result.data.nickname);
					setId(() => result.data.id);
				} else {
					toast.error(result.message, {
						progress: undefined,
						theme: 'colored',
					});
				}
				setIsLoading(() => false);
			})
			.catch((err) => {
				console.log(err.message);
				setIsLoading(() => false);
			});
	};

	// helper function for adding an attribute that will be used by CSS to animate input fields
	const handleChange = (event) => {
		if (event.target.value) {
			event.target.setAttribute('notEmpty', '');
		} else {
			event.target.removeAttribute('notEmpty');
		}
	};

	useEffect(() => {
		if (token) {
			navigate('/');
		}
	}, [token, navigate]);

	return (
		<div className='login-form-container'>
			<form
				className='login-form'
				onSubmit={handleSubmit}
			>
				<h1 className='form-header'>Login</h1>
				<div className='input-container'>
					<input
						className='form-input'
						name='username'
						type='email'
						placeholder='Johndoe@email.com'
						onChange={handleChange}
						ref={usernameRef}
					/>
					<label
						htmlFor='username'
						className='label'
					>
						Username
					</label>
				</div>

				<div className='input-container'>
					<input
						className='form-input'
						name='password'
						type='password'
						placeholder='Enter password'
						onChange={handleChange}
						ref={passwordRef}
					/>
					<label
						htmlFor='password'
						className='label'
					>
						Password
					</label>
				</div>
				<p>
					Don't have an account yet?{' '}
					<a
						href='/registration'
						className='navigation-link-small'
					>
						Register
					</a>
				</p>
				<div className='button-container'>
					{isLoading ? (
						<Loader size='small' />
					) : (
						<button type='submit'>Submit</button>
					)}
				</div>
			</form>
		</div>
	);
}
