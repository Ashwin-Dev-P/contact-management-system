import React, { Component } from 'react'

import { BrowserRouter as     Route, Link} from "react-router-dom";

//Config
import { config } from "../../../config.js";
import Loading from '../../Loading.js';
const configData = config();
const domain_url = configData.EXPRESS_JS_SERVER_URL

export default class CollegeStudentList extends Component {

    state = {
        loading: true,
        departments: null,
    };

    async componentDidMount() {
        
    const base_url = domain_url + "/api/member/section_id/";
    const section_id = this.props.match.params.section_id;

    const url = base_url + section_id ;
  

    //basic api authentication
    const username = process.env.REACT_APP_BASIC_AUTH_USERNAME ;
    const password = process.env.REACT_APP_BASIC_AUTH_PASSWORD;

    const response = await fetch(url, { 
        method: 'get', 
        headers: new Headers({
          'Authorization': 'Basic '+btoa(username+':'+password), 
          'Content-Type': 'application/x-www-form-urlencoded'
        })
      });
    const data = await response.json();
    
    this.setState({ students: data, loading: false });
    }


    render() {
        if (this.state.loading) {
            return <div className='text-center' > <Loading /> </div>;
        }
    
        if (!this.state.students) {
            return <div className='text-center' >No students found</div>;
        }

        if (this.state.students.length === 0 ) {
            return <div className='text-center' >No students is available</div>;
        }
        if (this.state.students.length === 1 ) {
            
            return <div className='text-center' >
                  
                    <Link to={`/details/${this.state.students[0]._id}`}  className='btn btn-primary btnLink mb-3'  >{this.state.students[0].username ? this.state.students[0].username : this.state.students[0].email}</Link>
                </div>;
        }

        return (
            <div>
                <h2 className='myHeading'>Students</h2>

                <ul>
                    {this.state.students.map((student) => (
                        <li key={student._id}  className='text-center'>
                            
                            <Link to={`/details/${student._id}`}  className='btn btn-primary btnLink mb-3' >{student.username ? student.username : student.email }</Link>
                        </li>
                    ))}
                </ul>

            </div>
        )
    }
}
