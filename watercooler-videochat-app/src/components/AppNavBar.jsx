import React, { useReducer } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useDispatch, useSelector } from 'react-redux';
import { setToken } from '../redux/token';

/* Incomplete*/

export default function AppNavBar() {
	const dispatch = useDispatch();

	const handleLogout = (event) => {
		dispatch(setToken(''));
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

				<Navbar.Collapse className='justify-content-end'>
					<Nav className='ms-auto'>
						<NavDropdown
							title='Dropdown'
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
							<NavDropdown.Item href='#action/3.3'>Something</NavDropdown.Item>
							<NavDropdown.Divider />
							<NavDropdown.Item href='#action/3.4'>
								Separated link
							</NavDropdown.Item>
						</NavDropdown>
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}
