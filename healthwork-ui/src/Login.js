import React from "react";
//import loginImg from "../../login.svg";
import axios from 'axios';
import { Redirect } from 'react-router-dom';


export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      email : '',
      password : '',
      redirect: false,
      patient: {},
    }
  }


  onemailchanged(e) {this.setState({email: e.target.value})}
  onpasswordchanged(e) {this.setState({password: e.target.value})}

  

  onFormSubmit(e) {
    e.preventDefault();

    axios.get('http://'+  process.env.REACT_APP_API_HOST  +':'+ process.env.REACT_APP_API_PORT+'/patients/' + this.state.email, {params: {password: this.state.password}}).then(res => {
      this.props.setLoading(false);
      this.props.setHidden(false);

      if (res.data.status) {
          this.setState({patient: res.data.patient, redirect: true});
      } else {
          alert(res.data.error.message);
          this.setState({redirect: false});
      }
  }).catch(err => {
      console.log(err);
      this.props.setLoading(false);
      this.props.setHidden(true);
      alert('Something went wrong')
  })

    }


    componentDidMount() {
      this.props.setHidden(true);
  }

  render() {

    if (this.state.redirect) {
      return <Redirect to={{pathname:'/view-patient-info/' + this.state.patient.Email, state:{password : this.state.password}}}/>
  }

  //this.props.setHidden(true);

  return(
    <div className="row">
    <form className="col s12" onSubmit={this.onFormSubmit.bind(this)}>
     
    <div className="row">
            <div className="input-field col s12">
                <input id="email" type="text" className="validate" required value={this.state.email} onChange={this.onemailchanged.bind(this)} />
                <label htmlFor="email">Email (e.g. abc@example.com)</label>
            </div>
        </div>
        <div className="row">
            <div className="input-field col s12">
                <input id="password" type="password" className="validate" required value={this.state.password} onChange={this.onpasswordchanged.bind(this)} />
                <label htmlFor="password">Password </label>
            </div>
        </div>
        <div className='row'>
            <div className="input-field col s12">
                <button className="btn waves-effect waves-light light-blue darken-3" type="submit" name="action">Submit
                    <i className="material-icons right">send</i>
                </button>
            </div>
        </div> 
        <div className="row">
          <div className="input-field col s12">
            <h6> Not Registered ? </h6>
            <a href="/register-patient"> Click here for Patient Registration</a>
          </div>
        </div>
    </form>
    </div>
  )

 
  }
}

