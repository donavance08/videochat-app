import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setToken, setNickname } from '../redux/user';
import { Navigate, useNavigate } from 'react-router-dom';

export default function Registration() {
	const nicknameRef = useRef();
	const usernameRef = useRef();
	const passwordRef = useRef();
	const confirmPasswordRef = useRef();
	const phoneNumberRef = useRef();
	const dispatch = useDispatch();
	const navigate = useNavigate(Navigate);
	const { token } = useSelector((state) => state.user);

	useEffect(() => {
		console.count('useEffect');
		if (token) {
			console.log('token', token);
			navigate('/');
		}
	}, [token]);

	const matchPassword = () => {
		if (passwordRef.current.value === confirmPasswordRef.current.value) {
			return true;
		}

		return false;
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		if (!matchPassword()) {
			//put badge error
			console.log('passwords do not match');
			return;
		}

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
				if (result.status === 'OK') {
					dispatch(setToken(result.data.token));
					dispatch(setNickname(result.data.nickname));
					return;
				}
				console.log(result.message);
			})
			.catch((err) => console.error(err));
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
						href='/users/login'
						className='navigation-link-small'
					>
						Log in
					</a>
				</p>
				<div className='button-container'>
					<button type='submit'>Submit</button>
				</div>
			</form>
		</div>
	);
}
