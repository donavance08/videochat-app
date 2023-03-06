export default function Loader({ size }) {
	return (
		<div className='loader-container'>
			<div className={`${size}-loader loader`}></div>
		</div>
	);
}
