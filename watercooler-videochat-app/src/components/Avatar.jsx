import React from 'react';

export default function Avatar({ src = null }) {
	const def = '/avatars/user.png';

	return (
		<div className='avatar-container'>
			{src ? (
				<img
					src={`/avatars/${src}.png`}
					alt=''
				/>
			) : (
				<img
					src={def}
					alt=''
				/>
			)}
		</div>
	);
}
