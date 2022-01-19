import React, { Component } from 'react'
import { BrowserRouter as     Route, Link} from "react-router-dom";
import Loading from '../../Loading'

//Config
import { config } from "../../../config.js";
const configData = config();
const domain_url = configData.EXPRESS_JS_SERVER_URL

export default class CollegeList extends Component {


    state = {
        loading: true,
        colleges: null,
    };

    async componentDidMount() {
        
        const url = domain_url + "/api/college";

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
        
        this.setState({ colleges: data, loading: false });
    }


    render() {

        if (this.state.loading) {
            return <div className='text-center' ><Loading /> </div>;
        }
    
        if (!this.state.colleges) {
            return <div className='text-center' >No data found</div>;
        }

        if (this.state.colleges.length === 0 ) {
            return <div className='text-center' >No colleges is available</div>;
        }

        if (this.state.colleges.length === 1 ) {
            return <div className='text-center' >
                

                <Link to={`/college/${this.state.colleges[0]._id}`}  className='btn btn-primary btnLink mb-2'  >{this.state.colleges[0].name}</Link>

            </div>;
        }

        return (
            <div>
                <h2 className='myHeading'>College list</h2>
                <ul>
                    {this.state.colleges.map((college) => (
                        <li key={college._id} className='text-center' >
                            <Link to={`/college/${college._id}`} className='btn btn-primary btnLink mb-2' >{college.name}</Link>
                        </li>
                    ))}
                </ul>
            </div>
        )
    }
}
