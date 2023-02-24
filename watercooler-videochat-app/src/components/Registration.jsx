import React from 'react';

export default function Registration() {
	const handleSubmit = (e) => {
		e.preventDefault();
		console.log(e.target.value);
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
						onChange={(e) => handleChange(e)}
					/>
					<label
						htmlFor='nickname'
						className='label'
					>
						Nickname
					</label>
				</div>
				<div className='input-container'>
					<input
						className='form-input'
						type='email'
						name='username'
						placeholder='Username'
						onChange={(e) => handleChange(e)}
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
						type='password'
						name='password'
						placeholder='Password'
						onChange={(e) => handleChange(e)}
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
						onChange={(e) => handleChange(e)}
					/>
					<label
						htmlFor='phoneNumber'
						className='label'
					>
						Phone Number
					</label>
				</div>
				<div className='button-container'>
					<button>Submit</button>
				</div>
			</form>
		</div>
	);
}
