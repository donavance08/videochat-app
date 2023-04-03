import React, { useContext, useEffect, useRef, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import UserContext from '../contexts/UserContext';
import Loader from '../utils/Loader';
import { toast } from 'react-toastify';

export default function Registration() {
	const nicknameRef = useRef();
	const usernameRef = useRef();
	const passwordRef = useRef();
	const confirmPasswordRef = useRef();
	const phoneNumberRef = useRef();
	const [isLoading, setIsLoading] = useState(false);

	const navigate = useNavigate(Navigate);
	const { token, setToken, setName, setId } = useContext(UserContext);

	useEffect(() => {
		if (token) {
			navigate('/');
		}
	}, [token, navigate]);

	const matchPassword = () => {
		return passwordRef.current.value === confirmPasswordRef.current.value;
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		if (!matchPassword()) {
			console.log('passwords do not match');
			return;
		}

		setIsLoading(true);
		fetch(`${process.env.REACT_APP_API_URL}/api/users/`, {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify({
				nickname: nicknameRef.current.value,
				username: usernameRef.current.value,
				password: passwordRef.current.value,
				phoneNumber: phoneNumberRef.current.value,
			}),
		})
			.then((response) => response.json())
			.then((result) => {
				console.log(result);
				if (result.status === 'OK') {
					setToken(() => result.data.token);
					setName(() => result.data.nickname);
					setId(() => result.data.id);
					navigate('/');
				} else {
					result.errors.forEach((error) => {
						toast.error(error.msg, {
							progress: undefined,
							theme: 'colored',
						});
					});
				}

				setIsLoading(false);
			})
			.catch((err) => {
				setIsLoading(false);
				console.error(err);
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

	return (
		<div className='login-form-container'>
			<form
				className='login-form'
				onSubmit={(e) => handleSubmit(e)}
			>
				<h1 className='form-header'>Register</h1>
				<div className='input-container'>
					<input
						className='form-input'
						type='text'
						name='nickname'
						placeholder='Nickname'
						ref={nicknameRef}
						onChange={(e) => {
							handleChange(e);
						}}
						required
					/>
					<label
						htmlFor='nickname'
						className='label'
					>
						Nickname
					</label>
				</div>
				<div className='input-container '>
					<input
						className='form-input '
						type='email'
						name='username'
						placeholder='Username'
						ref={usernameRef}
						onChange={(e) => {
							handleChange(e);
						}}
						required
					/>
					<label
						htmlFor='username'
						className='label'
					>
						Email
					</label>
				</div>

				<div className='input-container'>
					<input
						className='form-input'
						type='password'
						name='password'
						placeholder='Password'
						ref={passwordRef}
						onChange={(e) => {
							handleChange(e);
						}}
						required
					/>
					<label
						htmlFor='password'
						className='label'
					>
						Password
					</label>
				</div>
				<div className='input-container'>
					<input
						className='form-input'
						type='password'
						name='confirm-password'
						placeholder='Confirm Password'
						ref={confirmPasswordRef}
						onChange={(e) => {
							handleChange(e);
						}}
						required
					/>
					<label
						htmlFor='confirm-password'
						className='label'
					>
						Confirm Password
					</label>
				</div>
				<div className='input-container'>
					<input
						className='form-input'
						type='phone'
						name='phoneNumber'
						placeholder='Phone Number'
						ref={phoneNumberRef}
						onChange={(e) => {
							handleChange(e);
						}}
						required
					/>
					<label
						htmlFor='phoneNumber'
						className='label'
					>
						Phone Number
					</label>
				</div>
				<p>
					Already have an account?{' '}
					<a
						href='/login'
						className='navigation-link-small'
					>
						Log in
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
