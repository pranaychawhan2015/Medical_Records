import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
//import Multiselect from 'multiselect-react-dropdown';


export default class ViewPatient extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            key: this.props.match.params.key,
            name: '',
            redirect: false,
            patient: {},
            policies : [],
            policyName : '',
            operation : '',
            password : ''
        }
        //this.onSelect = this.onSelect.bind(this);
        //this.onRemove = this.onRemove.bind(this);
        //console.log(this);
    }

    onNameChanged(e) { 
        this.setState({ name: e.target.value })
    }

    onFormSubmit(e) {
        e.preventDefault();
        this.props.setLoading(true);
        console.log(this.state.policies);
        axios.put('http://'+  process.env.REACT_APP_API_HOST  +':'+ process.env.REACT_APP_API_PORT+'/patients', {
            key: this.state.patient.patientNumber,
            name: this.state.name,
            patient: this.state.patient,
            policies: this.state.policies,
            operation: this.state.operation
        }).then(res => {
            this.props.setLoading(false);
            if (res.data.status) {
                alert(res.data.message);
                this.setState({redirect: true})
                window.location.reload();
            } else {
                alert(res.data.error.message)
            }
        }).catch(err => {
            this.props.setLoading(false);
            alert('Something went wrong')
        });
    }

    componentDidMount() {
        this.props.setLoading(true);
        this.props.setHidden(false);
        if(this.props.location.state.password != null)
        {
            axios.get('http://'+  process.env.REACT_APP_API_HOST  +':'+ process.env.REACT_APP_API_PORT+'/patients/' + this.props.match.params.email,{params: {password: this.props.location.state.password}}).then(res => {
                this.props.setLoading(false);
                this.props.setHidden(false);
                if (res.data.status) {
                    this.setState({patient: res.data.patient});
                    console.log(res.data.patient);
                } else {
                    alert(res.data.error.message);
                    this.setState({redirect: true});
                }
            }).catch(err => {
                console.log(err);
                this.props.setLoading(false);
                alert('Something went wrong')
            })
        }
        else
        {
            axios.get('http://'+  process.env.REACT_APP_API_HOST  +':'+ process.env.REACT_APP_API_PORT+'/patients/' + this.props.match.params.email,{params: {password: this.state.password}}).then(res => {
                this.props.setLoading(false);
                if (res.data.status) {
                    this.setState({patient: res.data.patient});
                    console.log(res.data.patient);
                } else {
                    alert(res.data.error.message);
                    this.setState({redirect: true});
                }
            }).catch(err => {
                console.log(err);
                this.props.setLoading(false);
                alert('Something went wrong')
            })
        }
    }

    onPolicyChanged(e)
    {
        e.preventDefault();
        console.log(e.target.value);
        console.log(e.target.label);
        this.state.policies = [];
        this.state.policies.push(e.target.value);
        if(e.target.value == ['Lab_Technician','Doctor'])
        {
            this.state.operation = "testsampleReport";
        }
        else
        {
            this.state.operation = "dischargeReport";   
        }
        console.log(this.state.operation);
        this.setState({policyName: e.target.value, policies: e.target.value})

        // this.state.policies.push(e.target.value);
        // this.state.policies.forEach(element=>{
        //     console.log(element);
        // })
        //console.log(this.state.policies.find(x=>x.name == "Roles"));
        //console.log(e.target.value);        
    }


    render() {
        if (this.state.redirect) {
            return <Redirect to={{pathname:'/view-patient-info/' + this.state.patient.Email, state:{params: {password: this.state.password}}}}/>
        }
        
        
        const info = typeof this.state.patient.Name !== 'undefined' ? <div className="row">
            
            <div className="col s12">
            <table className='striped responsive-table'>
                <tbody>
                    <tr><td style={{border: "3px solid rgb(0, 0, 0)",width: '50%', textAlign: 'center'}}>Email </td><td style={{textAlign: 'center',border: "3px solid rgb(0, 0, 0)"}}>{this.state.patient.Email}</td></tr>
                    <tr><td style={{border: "3px solid rgb(0, 0, 0)",width: '50%', textAlign: 'center'}}>Adhar </td><td style={{border: "3px solid rgb(0, 0, 0)",textAlign: 'center'}}>{this.state.patient.Adhar}</td></tr>
                    <tr><td style={{border: "3px solid rgb(0, 0, 0)",width: '50%', textAlign: 'center'}}>Patient Number </td><td style={{border: "3px solid rgb(0, 0, 0)",textAlign: 'center'}}>{this.state.patient.patientNumber}</td></tr>
                    <tr><td style={{border: "3px solid rgb(0, 0, 0)",width: '50%', textAlign: 'center'}}>Name </td><td style={{border: "3px solid rgb(0, 0, 0)",textAlign: 'center'}}>{this.state.patient.Name}</td></tr>
                    <tr><td style={{border: "3px solid rgb(0, 0, 0)",width: '50%', textAlign: 'center'}}>Age </td><td style={{border: "3px solid rgb(0, 0, 0)",textAlign: 'center'}}>{this.state.patient.Age}</td></tr>
                    <tr><td style={{border: "3px solid rgb(0, 0, 0)",width: '50%', textAlign: 'center'}}>Doctor Specialization </td><td style={{textAlign: 'center',border: "3px solid rgb(0, 0, 0)"}}>{this.state.patient.Doctor_Specialization}</td></tr>
                    <tr><td style={{border: "3px solid rgb(0, 0, 0)",width: '50%', textAlign: 'center'}}>Disease </td><td style={{textAlign: 'center',border: "3px solid rgb(0, 0, 0)"}}>{this.state.patient.Disease}</td></tr>
                     {this.state.patient.sample_ID ? (
                                            <tr><td style={{border: "3px solid rgb(0, 0, 0)",width: '50%', textAlign: 'center'}}>Sample ID :</td><td style={{textAlign: 'center',border: "3px solid rgb(0, 0, 0)"}}>{this.state.patient.sample_ID}</td></tr>
                     ) :(<tr hidden={true}><td></td></tr>)
                    }
                      {this.state.patient.Facility_Name ? (
                                            <tr><td style={{border: "3px solid rgb(0, 0, 0)",width: '50%', textAlign: 'center'}}>Facility Name :</td><td style={{textAlign: 'center',border: "3px solid rgb(0, 0, 0)"}}>{this.state.patient.Facility_Name}</td></tr>
                      ) :(<tr hidden={true}><td></td></tr>)
                    }  
                     {this.state.patient.Speciman_Type ? (
                                            <tr><td style={{border: "3px solid rgb(0, 0, 0)",width: '50%', textAlign: 'center'}}>Speciman Type </td><td style={{textAlign: 'center',border: "3px solid rgb(0, 0, 0)"}}>{this.state.patient.Speciman_Type}</td></tr>
                     ) : (<tr hidden={true}><td></td></tr>)
                    }
                     {this.state.patient.Facility_Contact ? (
                                            <tr><td style={{border: "3px solid rgb(0, 0, 0)",width: '50%', textAlign: 'center'}}>Facility Contact </td><td style={{textAlign: 'center',border: "3px solid rgb(0, 0, 0)"}}>{this.state.patient.Facility_Contact.number.national}</td></tr>
                     ): (<tr hidden={true}><td></td></tr>)
                    }   
                     { this.state.patient.DateOfTesting ? (
                                            <tr><td style={{border: "3px solid rgb(0, 0, 0)",width: '50%', textAlign: 'center'}}>Date Of Testing </td><td style={{textAlign: 'center',border: "3px solid rgb(0, 0, 0)"}}>{this.state.patient.DateOfTesting}</td></tr>
                     ): (<tr hidden={true}><td></td></tr>)
                    }   
                     {this.state.patient.Practitioner ? (
                                            <tr><td style={{border: "3px solid rgb(0, 0, 0)",width: '50%', textAlign: 'center'}}>Practitioner </td><td style={{textAlign: 'center',border: "3px solid rgb(0, 0, 0)"}}>{this.state.patient.Practitioner}</td></tr>
                     ): (<tr hidden={true}><td></td></tr>)
                    }
                     {this.state.patient.Discharging_consultant ? (
                                            <tr><td style={{border: "3px solid rgb(0, 0, 0)",width: '50%', textAlign: 'center'}}>Discharing Consultant </td><td style={{textAlign: 'center',border: "3px solid rgb(0, 0, 0)"}}>{this.state.patient.Discharging_consultant}</td></tr>
                     ): (<tr hidden={true}><td></td></tr>)
                    }
                    {this.state.patient.Discharging_Speciality ? (
                                            <tr><td style={{border: "3px solid rgb(0, 0, 0)",width: '50%', textAlign: 'center'}}>Discharging Speciality :</td><td style={{textAlign: 'center',border: "3px solid rgb(0, 0, 0)"}}>{this.state.patient.Discharging_Speciality}</td></tr>
                    ): (<tr hidden={true}><td></td></tr>)
                    }
                    {this.state.patient.Discharging_Contact ? (
                                            <tr><td style={{border: "3px solid rgb(0, 0, 0)",width: '50%', textAlign: 'center'}}>Discharging Contact :</td><td style={{textAlign: 'center',border: "3px solid rgb(0, 0, 0)"}}>{this.state.patient.Discharging_Contact.number.national}</td></tr>
                    ): (<tr hidden={true}><td></td></tr>)
                    }

                </tbody>
            </table>
            </div>
        </div> : <h6>Loading information...</h6>
        return (
            <div> 
                <h4>Patient Information</h4>
                {info}

                <h4>View Reports</h4>
                <div className="row">
                    <form className="col s12" onSubmit={this.onFormSubmit.bind(this)}>        
                        {/* <div className="row">
                            <input disabled id="key" type="hidden" className="validate" value={this.state.key} />
                            <div className="input-field col s12">
                                <input id="name" type="text" className="validate" required value={this.state.name} onChange={this.onNameChanged.bind(this)} />
                                <label htmlFor="name">New Name</label>
                            </div>
                        </div> */}

                        <div className="row">
                {/* <h4>Select Policy</h4> */}
                {/* <Multiselect 
options={this.state.options} // Options to display in the dropdown
selectedValues={this.state.selectedValue} // Preselected value to persist in dropdown
onSelect={this.onSelect} // Function will trigger on select event
onRemove={this.onRemove} // Function will trigger on remove event
displayValue="label" // Property name to display in the dropdown options
/> */}

<select className='browser-default' required value={this.state.policyName} onChange={this.onPolicyChanged.bind(this)} style={{border: "3px solid rgb(0, 0, 0)"}}>
                                                       <option value=""   disabled>Choose policy</option>
                                                       <option value={['Lab_Technician','Doctor']} label='Test Sample Report'>Test Sample Report</option>
                                                       <option value={['Doctor','Admin']} label= 'Discharge Summary'>Discharge Summary</option>
</select>

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
            </div>
        )
    }

    onSelect(selectedList, selectedItem) {
        selectedItem.value.forEach(element => {
            this.state.policies.push(element);
        });
    }
    
    onRemove(selectedList, removedItem) {
        removedItem.value.forEach(element => {
            this.state.policies.pop(element);
        });   
    }
}