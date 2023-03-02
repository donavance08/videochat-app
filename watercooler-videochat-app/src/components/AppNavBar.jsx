import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useDispatch, useSelector } from 'react-redux';
import { setToken, setNickname } from '../redux/user';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import UserContext from '../UserContext';

/* Incomplete*/

export default function AppNavBar() {
	const { nickname } = useSelector((state) => state.user);
	const { socket } = useContext(UserContext);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const handleLogout = (event) => {
		dispatch(setToken(''));
		dispatch(setNickname(''));

		socket?.disconnect();

		navigate('/');
	};

	return (
		<Navbar>
			<Container>
				<Navbar.Brand
					href='/'
					className='text-light'
				>
					WaterCooler
				</Navbar.Brand>
				<Navbar.Toggle />

				{nickname ? (
					<Navbar.Collapse className='justify-content-end'>
						<Nav className='ms-auto'>
							<NavDropdown
								className='text-light'
								title={`${nickname}`}
								id='basic-nav-dropdown'
							>
								<NavDropdown.Item
									href='#action/3.1'
									onClick={(e) => {
										handleLogout(e);
									}}
								>
									Logout
								</NavDropdown.Item>
								<NavDropdown.Item href='#action/3.2'>
									Another action
								</NavDropdown.Item>
								<NavDropdown.Item href='#action/3.3'>
									Something
								</NavDropdown.Item>
								<NavDropdown.Divider />
								<NavDropdown.Item href='#action/3.4'>
									Separated link
								</NavDropdown.Item>
							</NavDropdown>
						</Nav>
					</Navbar.Collapse>
				) : (
					<></>
				)}
			</Container>
		</Navbar>
	);
}
