import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import './Navbar.css';

export default class Navbar extends Component {
	render() {
		return (
			<nav className="uk-navbar-container" uk-navbar="true">
				<div className="uk-navbar-left">
					<div className="uk-navbar-item uk-logo">
						<img className="logo" src="./assets/logo.png" alt="Eventify Logo"/>
					</div>

					<ul className="uk-navbar-nav">
						<li name="events">
							<NavLink to="/events">Events</NavLink>
						</li>
						<li name="bookings">
							<NavLink to="/bookings">Bookings</NavLink>
						</li>
					</ul>
				</div>

				<div className="uk-navbar-right">
					<ul className="uk-navbar-nav">
						<li name="login">
							<NavLink to="/login">Login</NavLink>
						</li>
					</ul>
				</div>
			</nav>
		);
	}
}
