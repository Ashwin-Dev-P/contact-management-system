import React, { Component } from 'react'
import { BrowserRouter as     Route, Link} from "react-router-dom";

//Config
import { config } from "../../../config.js";
import Loading from '../../Loading.js';
const configData = config();
const domain_url = configData.EXPRESS_JS_SERVER_URL

export default class SectionList extends Component {

    state = {
        loading: true,
        departments: null,
    };

    async componentDidMount() {
        
    const base_url = domain_url + "/api/section/department_id/";
    const department_id = this.props.match.params.department_id;

    const url = base_url + department_id ;


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
   
    this.setState({ sections: data, loading: false });
    }

    render() {
        if (this.state.loading) {
            return <div  className='text-center'> <Loading /> </div>;
        }
    
        if (!this.state.sections) {
            return <div className='text-center' >No sections found</div>;
        }

        if (this.state.sections.length === 0 ) {
            return <div className='text-center' >No sections is available</div>;
        }
        if (this.state.sections.length === 1 ) {
            return <div  className='text-center' ><Link to={`/section/${this.state.sections[0]._id}`}  className='btn btn-primary btnLink mb-3'  >{this.state.sections[0].section_name}</Link></div>;
        }

        return (
            <div>
                <h2 className='myHeading'>Sections</h2>
                <ul>
                    {this.state.sections.map((section) => (
                        <li key={section._id}  className='text-center' >
                            <Link to={`/section/${section._id}`}  className='btn btn-primary btnLink mb-3'  >{section.section_name}</Link>
                        </li>
                    ))}

                </ul>
            </div>
        )
    }
}
