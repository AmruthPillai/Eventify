import React, { Component } from 'react';
import { Menu } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';

export default class Navbar extends Component {
	state = {};

	handleItemClick = (e, { name }) =>
		this.setState({
			activeItem: name
		});

	render() {
		const { activeItem } = this.state;

		return (
			<header className="Navbar">
				<Menu stackable inverted className="ui container">
					<Menu.Item>
						<strong>Eventify</strong>
					</Menu.Item>

					<Menu.Item
						name="events"
						as={NavLink}
						to="/events"
						active={activeItem === 'events'}
						onClick={this.handleItemClick}
					/>

					<Menu.Item
						name="bookings"
						as={NavLink}
						to="/bookings"
						active={activeItem === 'bookings'}
						onClick={this.handleItemClick}
					/>

					<Menu.Menu position="right">
						<Menu.Item
							name="login"
							as={NavLink}
							to="/login"
							active={activeItem === 'login'}
							onClick={this.handleItemClick}
						/>
					</Menu.Menu>
				</Menu>
			</header>
		);
	}
}
