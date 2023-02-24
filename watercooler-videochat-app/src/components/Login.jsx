import React, { useRef } from 'react';

export default function Login() {
	const usernameRef = useRef();
	const passwordRef = useRef();

	const handleSubmit = (event) => {
		event.preventDefault();

		fetch('http://localhost:5000/api/users/login', {
			method: 'POST',
			headers: {
				'Content-type': 'application/json',
			},
			body: JSON.stringify({
				username: usernameRef.current.value,
				password: passwordRef.current.value,
			}),
		})
			.then((response) => {
				console.log(response);
				if (response?.status === 200) {
					return response.json();
				}
				console.log('login failed');
			})
			.then((result) => {
				console.log(result);
			})
			.catch((err) => {
				console.log('error', err.message);
			});
	};

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
				<h1 className='form-header'>Login</h1>
				<div className='input-container'>
					<input
						className='form-input'
						name='username'
						type='email'
						placeholder='Johndoe@email.com'
						onChange={(e) => handleChange(e)}
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
						onChange={(e) => handleChange(e)}
						ref={passwordRef}
					/>
					<label
						htmlFor='password'
						className='label'
					>
						Password
					</label>
				</div>
				<div className='button-container'>
					<button type='submit'>Submit</button>
				</div>
			</form>
		</div>
	);
}
