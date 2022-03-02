import React from 'react';

import { BrowserRouter, Route, Link, Switch } from 'react-router-dom';

import AllPatients from './AllPatients';
import AddPatient from './AddPatient';
import ViewPatient from './ViewPatient';
import NotFound from './NotFound';
import RegisterAdmin from './RegisterAdmin';
import RegisterPatient  from './RegisterPatient';
import Login from './Login';


class App extends React.Component {
	constructor() {
		super();
		this.state = {
			isLoading: false,
			isHidden: true
		}
	}

	render() {
		return (
			<BrowserRouter>
				<nav className='light-blue darken-3'>
					<div className="nav-wrapper">
						<div className='container' style={{bottom:'50px'}}>
							<h4 className='brand-logo' style={{bottom:'2px', right:'510px'}} > Medical Records</h4>
							{this.state.isHidden ?
							 <ul hidden={true} id="nav-mobile" className="right hide-on-med-and-down">
								
								<li><Link to='/' ><i className='material-icons left'>directions_car</i>All Patients</Link></li>
							</ul>:
							 <ul hidden={false} id="nav-mobile" className="right hide-on-med-and-down">
								
							 <li><Link to='/' ><i className='material-icons left'>logout</i>Log out</Link></li>
						 </ul>
							} 
						</div>
					</div>
				</nav>
				<div className='container'>
					<Switch>
						<Route exact path="/allpatients" render={
							(props) => <AllPatients {...props} setLoading={(status) => {this.setState({isLoading: status})}} setHidden={(status) => {this.setState({isHidden: status})}}/>
						} />

						<Route exact path="/" render={
							(props) => <Login {...props} setLoading={(status) => {this.setState({isLoading: status})}} setHidden={(status) => {this.setState({isHidden: status})}} />
						} />
						
						<Route exact path="/add" render={
							(props) => <AddPatient {...props} setLoading={(status) => {this.setState({isLoading: status})}} setHidden={(status) => {this.setState({isHidden: status})}} />
						} />

						<Route exact path="/view-patient-info/:email" render={
							(props) => <ViewPatient {...props} setLoading={(status) => {this.setState({isLoading: status})}} setHidden={(status) => {this.setState({isHidden: status})}} />
						} />

						{/* <Route exact path="/register-admin/" render={
							(props) => <RegisterAdmin {...props} setLoading={(status) => {this.setState({isLoading: status})}} />
						} /> */}

						<Route exact path="/register-patient/" render={
							(props) => <RegisterPatient {...props} setLoading={(status) => {this.setState({isLoading: status})}} setHidden={(status) => {this.setState({isHidden: status})}} />
						} />

						<Route exact path="/login/" render={
							(props) => <Login {...props} setLoading={(status) => {this.setState({isLoading: status})}} setHidden={(status) => {this.setState({isHidden: status})}}  />
						} />
						
						<Route path='/*' component={NotFound} />
					</Switch>
				</div>
			</BrowserRouter>
		);
	}
}

export default App;
