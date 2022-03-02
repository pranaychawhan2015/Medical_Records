import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

export default class AddPatient extends React.Component {
    constructor() {
        super();
        this.state = {
            key: '',
            name: '',
            age: '',
            disease: '',
            specialization: '',
            //policies: [],
            redirect: false,
            adhar: ''
        }
    }

    onKeyChanged(e) { this.setState({ key: e.target.value.toUpperCase() }) }
    onNameChanged(e) { this.setState({ name: e.target.value }) }
    onAgeChanged(e) {this.setState({ age: e.target.value }) }
    onDiseaseChanged(e) { this.setState({ disease: e.target.value }) }
    onspecializationChanged(e) { this.setState({ specialization: e.target.value }) }
    onadharChanged(e) {this.setState({adhar: e.target.value})}

    onFormSubmit(e) {
        e.preventDefault();

        // if(this.handleValidation())
        // {
            this.props.setLoading(true);
            console.log(this.state.policies);
            axios.post('http://'+  process.env.REACT_APP_API_HOST  +':'+ process.env.REACT_APP_API_PORT+'/patients', {
                key: this.state.key,
                name: this.state.name,
                age: this.state.age,
                disease: this.state.disease,
                specialization: this.state.specialization,
                //policies: this.state.policies
            }).then(res => {
                this.props.setLoading(false);
                if (res.data.status) {
                    alert(res.data.message);
                    this.setState({redirect: true})
                } else {
                    alert(res.data.error.message)
                }
            }).catch(err => {
                this.props.setLoading(false);
                alert('Something went wrong')
            });
        // }
        // else
        // {
        //     alert('form has errors');
        // }
    }

    handleValidation()
    {
        let age = this.state.age;
        let adhar = this.state.adhar;

        //let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;

        //Name
        if (typeof age != 'number') {
            formIsValid = false;
            errors["age"] = "age should not contain alphabets";
            console.log(errors);    
        }

        if(typeof adhar !== 'number')
        {
            formIsValid = false;
            errors['adhar'] = 'adhar number should not contain alphabets'
            console.log(errors);    
        }
        
        if(adhar.length !== 12)
        {
            formIsValid = false;
            errors['adhar'] = 'adhar number should contain 12 digits only';
        }
            console.log(errors);    
            return formIsValid;
    }

    // onPolicyChanged(e)
    // {
    //     e.preventDefault();
    //     console.log(e.target.value);
    //     this.state.policies = [];
    //     this.state.policies.push(e.target.value);
    //     this.setState({policyName: e.target.value, policies: this.state.policies})

    //     // this.state.policies.push(e.target.value);
    //     // this.state.policies.forEach(element=>{
    //     //     console.log(element);
    //     // })
    //     console.log(this.state.policies);
    //     //console.log(e.target.value);        
    // }


    render() {
        if (this.state.redirect) {
            return <Redirect to='/'/>
        }
        return (
            <div>
                <h4>Add Patient</h4>
                <div className="row">
                    <form className="col s12" onSubmit={this.onFormSubmit.bind(this)}>
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
                                    <option>Internal Medicine</option>
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
                        {/* <div className="row"> */}
                {/* <h4>Select Policy</h4> */}
                {/* <Multiselect 
options={this.state.options} // Options to display in the dropdown
selectedValues={this.state.selectedValue} // Preselected value to persist in dropdown
onSelect={this.onSelect} // Function will trigger on select event
onRemove={this.onRemove} // Function will trigger on remove event
displayValue="label" // Property name to display in the dropdown options
/> */}

{/* <select className='browser-default' style={{border: "1px solid rgb(0, 0, 0)"}} required value={this.state.policyName} onChange={this.onPolicyChanged.bind(this)}>
                                                       <option value="" disabled>Choose policy</option>
                                                       <option value={['Lab_Techinician','specialization']} label='Health Department Approvals'>Health Department Approvals</option>
                                                       <option value={['Admin']} label= 'Admin Department Approvals'>Admin Department Approvals</option>
                                                       <option value= {['Pharmacy']} label= 'Pharmaceutical Department Approvals'>Pharmaceutical Department Approvals</option>
</select> */}

                        {/* </div> */}
                        <div className='row'>
                            <div className="input-field col s12">
                                <button className="btn waves-effect waves-light light-blue darken-3" type="submit" name="action">Submit
                                    <i className="material-icons right">send</i>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}