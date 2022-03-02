import React from "react";
//import loginImg from "../../login.svg";
import axios from 'axios';
import { Redirect } from 'react-router-dom';


export default class RegisterPatient extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      key: '',
      name: '',
      age: '',
      disease: '',
      specialization: '',
      //policies: [],
      redirect: false,
      adhar: '',
      email: '',
      password: '',
      organization: ''

    }
  }



  onKeyChanged(e) { this.setState({ key: e.target.value.toUpperCase() }) }
  onNameChanged(e) { this.setState({ name: e.target.value }) }
  onAgeChanged(e) {this.setState({ age: e.target.value }) }
  onDiseaseChanged(e) { this.setState({ disease: e.target.value }) }
  onspecializationChanged(e) { this.setState({ specialization: e.target.value }) }
  onadharChanged(e) {this.setState({adhar: e.target.value})}
  onemailchanged(e) {this.setState({email: e.target.value})}
  onpasswordchanged(e) {this.setState({password: e.target.value})}
  onorganizationchanged(e) {this.setState({organization: e.target.value})}


  onFormSubmit(e) {
    e.preventDefault();

    // if(this.handleValidation())
    // {
        this.props.setLoading(true);
        //console.log(this.state.policies);
        axios.post('http://'+  process.env.REACT_APP_API_HOST  +':'+ process.env.REACT_APP_API_PORT+'/patients', {
            key: this.state.key,
            name: this.state.name,
            age: this.state.age,
            disease: this.state.disease,
            specialization: this.state.specialization,
            email: this.state.email,
            adhar: this.state.adhar,
            password : this.state.password
            //policies: this.state.policies
        }).then(res => {
            this.props.setLoading(false);
            this.props.setHidden(true);
            if (res.data.status) {
                alert(res.data.message);
                this.setState({redirect: true })
            } else {
                alert(res.data.error.message)
            }
        }).catch(err => {
            this.props.setLoading(false);
            this.props.setHidden(true);
            alert('Something went wrong')
        });
        console.log(1);
    // }
    // else
    // {
    //     alert('form has errors');
    // }
    }
  
  render() {;
    if (this.state.redirect) {
      return <Redirect  to={{pathname:'/view-patient-info/' + this.state.email, state:{password: this.state.password}}}/>
  }
    return ( 
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
          <div className="row">
              <div className="input-field col s12">
                  <input id="key" type="text" className="validate" required value={this.state.key} onChange={this.onKeyChanged.bind(this)} />
                  <label htmlFor="key">Patient Number (e.g. Patient102)</label>
              </div>
          </div>
          <div className="row">
              <div className="input-field col s12">
                  <input id="adhar" type="text" className="validate" required value={this.state.adhar} onChange={this.onadharChanged.bind(this)} />
                  <label htmlFor="adhar">Aadhar Number </label>
              </div>
          </div>
          <div className="row">
              <div className="input-field col s4">
                  <input id="name" type="text" required className="validate" required value={this.state.name} onChange={this.onNameChanged.bind(this)} />
                  <label htmlFor="name">Name (e.g. Lexus)</label>
              </div>
              <div className="input-field col s4">
                  <input id="age" type="text" required className="validate"  required value={this.state.age} onChange={this.onAgeChanged.bind(this)}  />
                  <label htmlFor="age">Age (e.g. 20)</label>
              </div>
              <div className="input-field col s4">
                  <select style={{border: "1px solid rgb(0, 0, 0)"}} className="browser-default" required value={this.state.specialization} onChange={this.onspecializationChanged.bind(this)}>
                      <option value="" disabled>Choose specialization</option>
                      <option>Orthopedics</option>
                      <option>Obstetrics and Gynecology</option>
                      <option>Dermatology</option>
                      <option>Pediatrics</option>
                      <option>Radiology</option>
                  </select>
              </div>
          </div>
          <div className="row">
              <div className="input-field col s12">
                  <input id="disease" type="text" className="validate" required value={this.state.disease} onChange={this.onDiseaseChanged.bind(this)} />
                  <label htmlFor="disease">Disease</label>
              </div>
          </div>
          <div className='row'>
              <div className="input-field col s12">
                  <button className="btn waves-effect waves-light light-blue darken-3" type="submit" name="action">Submit
                      <i className="material-icons right">send</i>
                  </button>
              </div>
          </div>
      </form>
  </div>


    );
  }
}

