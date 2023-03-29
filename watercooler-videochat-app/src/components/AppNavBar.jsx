import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import UserContext from '../contexts/UserContext';
import { resetChatState } from '../redux/chat';
import Search from './Search';
import Avatar from 'react-avatar';

/* Incomplete*/

export default function AppNavBar() {
	const { name, resetContextValues, token } = useContext(UserContext);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleLogout = (event) => {
		dispatch(resetChatState());
		resetContextValues();

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

				{token && <Search />}
				<Navbar.Toggle />

				{name && (
					<Navbar.Collapse className='justify-content-end'>
						<Nav className='ms-auto'>
							<NavDropdown
								title={
									<Avatar
										name={`${name}`}
										maxInitials={2}
										size={'45px'}
										round={true}
									/>
								}
								id='basic-nav-dropdown'
							>
								<NavDropdown.Item onClick={handleLogout}>
									Logout
								</NavDropdown.Item>
							</NavDropdown>
						</Nav>
					</Navbar.Collapse>
				)}
			</Container>
		</Navbar>
	);
}
