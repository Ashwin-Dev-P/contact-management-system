import React, { Component } from 'react'
import Loading from '../../Loading';
import { BrowserRouter as     Route, Link} from "react-router-dom";

//Config
import { config } from "../../../config.js";
const configData = config();
const domain_url = configData.EXPRESS_JS_SERVER_URL

export default class SchoolList extends Component {


    state = {
        loading: true,
        schools: null,
    };

    async componentDidMount() {
        
        const url = domain_url + "/api/school";

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
        
        this.setState({ 
            schools: data, 
            loading: false,
        
        
        });
    }


    render() {
        return (
            <div>
                <h2>Schools</h2>
                {this.state.loading ? <Loading />:
                    <> {this.state.schools.length === 1 ? 
                        
                        <><Link to={`/school/${this.state.schools[0]._id}`} >{this.state.schools[0].name}</Link></>
                        
                        :
                        
                        <>
                            <ul>
                                {this.state.schools.map((school) => (
                                    <li key={school._id} >
                                        <Link to={`/school/${school._id}`} >{school.name}</Link>
                                    </li>
                                ))}
                            </ul>
                        </>
                        }
                    </>
                }
                
            </div>
        )
    }
}
