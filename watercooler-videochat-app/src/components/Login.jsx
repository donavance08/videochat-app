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
	return (
		<div className='login-form-container'>
			<form
				className='login-form'
				onSubmit={(e) => handleSubmit(e)}
			>
				<div>
					<label>Username: </label>
					<input
						type='email'
						placeholder='Johndoe@email.com'
						ref={usernameRef}
					/>
				</div>

				<div>
					<label>Password: </label>
					<input
						type='password'
						placeholder='Enter password'
						ref={passwordRef}
					/>
				</div>
				<div className='login-button-container'>
					<button type='submit'>Login</button>
				</div>
			</form>
		</div>
	);
}
