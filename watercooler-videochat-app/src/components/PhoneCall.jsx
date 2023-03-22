import PhoneDialer from './PhoneDialer';

export default function PhoneCall({ phoneNumber }) {
	return (
		<div className='phone-call-container col-7'>
			<PhoneDialer phoneNumber={phoneNumber} />
		</div>
	);
}
