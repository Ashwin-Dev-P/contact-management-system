import React, { Component } from 'react'
import Batch from './Batch';
import Department from './Department';
import Section from './Section';

//Config
import { config } from "../../config.js";
const configData = config();
const domain_url = configData.EXPRESS_JS_SERVER_URL

export default class CollegeDetails extends Component {

    state = {
        loading: true
    };

    async componentDidMount() {

        const url = domain_url + "/api/college";

        //basic api authentication
        const username = process.env.REACT_APP_BASIC_AUTH_USERNAME;
        const password = process.env.REACT_APP_BASIC_AUTH_PASSWORD;

        const response = await fetch(url, {
            method: 'get',
            headers: new Headers({
                'Authorization': 'Basic ' + btoa(username + ':' + password),
                'Content-Type': 'application/x-www-form-urlencoded'
            })
        });
        const colleges = await response.json();

        this.setState({
            colleges: colleges,
            loading: false,
            college_name: "",


        });
    }

    changeHandler = (e) => {

        const college_name = document.getElementById('college_name').value;
        this.setState({
            college_name: college_name,


        });

    }


    render() {


        return (
            <div>

                <div>


                    <br />
                    <label htmlFor="college_name">college name:</label>

                    <input className='form-control' type="text" name="college_name" id='college_name' list="college_names" onChange={this.changeHandler} />


                    {!this.state.loading ?
                        <datalist id="college_names" >
                            {this.state.colleges.map((college) => (

                                <option value={college.name} key={college._id} >{college.name}</option>

                            ))}
                        </datalist>
                        :
                        <></>
                    }


                </div>
                <div>
                    <br /><Batch /><br />
                </div>
                <div>
                    <Department college_name={this.state.college_name} /><br />
                </div>

                <Section />

            </div>
        )
    }
}

//CSS: https://stackoverflow.com/questions/35196782/how-to-make-datalist-arrow-to-be-always-visible
