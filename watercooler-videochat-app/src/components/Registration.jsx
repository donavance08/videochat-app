import React, { useRef } from 'react';

export default function Registration() {
	const nicknameRef = useRef();
	const usernameRef = useRef();
	const passwordRef = useRef();
	const phoneNumberRef = useRef();

	const handleSubmit = (e) => {
		fetch('http://localhost:5000/api/users/', {
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
			.then((result) => console.log(result))
			.catch((err) => console.error(err));

		e.preventDefault();
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
				<div className='button-container'>
					<button type='submit'>Submit</button>
				</div>
			</form>
		</div>
	);
}
