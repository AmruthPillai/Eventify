import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import './App.css';

import AuthPage from './pages/Auth';
import EventsPage from './pages/Events';
import BookingsPage from './pages/Bookings';

import Navbar from './components/Navigation/Navbar';

class App extends Component {
	render() {
		return (
			<BrowserRouter>
				<React.Fragment>
					<Navbar className='Navbar' />

					<Switch>
						<Redirect from="/" to="/login" exact />
						<Route path="/login" component={AuthPage} />
						<Route path="/events" component={EventsPage} />
						<Route path="/bookings" component={BookingsPage} />
					</Switch>
				</React.Fragment>
			</BrowserRouter>
		);
	}
}

export default App;
