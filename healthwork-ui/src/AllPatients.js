import React from 'react';
import axios from 'axios';

import { Link } from 'react-router-dom';

export default class AllPatients extends React.Component {
    constructor() {
        super();
        this.state = {
            patients: []
        }
    }
    componentDidMount() {
        this.props.setLoading(true);
        axios.get('http://'+  process.env.REACT_APP_API_HOST  +':'+ process.env.REACT_APP_API_PORT+'/patients').then(res => {
            this.props.setLoading(false);
            if(res.data.status) {
                this.setState({patients: res.data.patients})
            } else {
                alert(res.data.error.message)
            }
        }).catch(err => {
            console.log(err);
            this.props.setLoading(false);
            alert('Something went wrong')
        })
    }

    render() {
        const tbody = this.state.patients.map(patient => {
            return <tr style={{border: "3px solid rgb(0, 0, 0)"}} key={patient.Key}>
                <td style={{border: "3px solid rgb(0, 0, 0)"}}>{patient.Key}</td>
                <td style={{border: "3px solid rgb(0, 0, 0)"}}>{patient.Record.Name}</td>
                <td style={{border: "3px solid rgb(0, 0, 0)"}}>{patient.Record.Age}</td>
                <td style={{border: "3px solid rgb(0, 0, 0)"}}>{patient.Record.Disease}</td>
                <td style={{border: "3px solid rgb(0, 0, 0)"}}>{patient.Record.Doctor_Specialization}</td>
                <td>
                    <Link to={'/View-Patient-Info/' + patient.Key} className="waves-effect waves-light btn light-blue darken-3"><i className="material-icons">edit</i></Link>
                </td>
            </tr>
        })
        return (
            <div>
                <h4>All Patients</h4>
                <table style={{border: "3px solid rgb(0, 0, 0)"}} className='striped responsive-table centered'>
                    <thead>
                        <tr style={{border: "3px solid rgb(0, 0, 0)"}} >
                            <th style={{border: "3px solid rgb(0, 0, 0)"}}>Patient Number</th>
                            <th style={{border: "3px solid rgb(0, 0, 0)"}}>Name</th>
                            <th style={{border: "3px solid rgb(0, 0, 0)"}}>Age</th>
                            <th style={{border: "3px solid rgb(0, 0, 0)"}}>Disease</th>
                            <th style={{border: "3px solid rgb(0, 0, 0)"}}>Doctor Specialization</th>
                            <th style={{width: 100}}>View</th>
                        </tr>
                    </thead>

                    <tbody>
                        {tbody}
                    </tbody>
                </table>
            </div>
        )
    }
}