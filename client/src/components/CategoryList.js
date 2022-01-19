import React, { Component } from 'react'

import { BrowserRouter as     Route, Link} from "react-router-dom";

//Config
import { config } from "../config.js";
import Loading from './Loading.js';
const configData = config();
const domain_url = configData.EXPRESS_JS_SERVER_URL

export default class CategoryList extends Component {

    state = {
        loading: true,
        persons: null,
    };
    
    async componentDidMount() {
        
        const url = domain_url + "/api/organisation_category";

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
      
        this.setState({ categories: data, loading: false });
    }

    render() {

        if (this.state.loading) {
            return <div className='text-center' > <Loading /> </div>;
        }
      
        if (!this.state.categories) {
            return <div className='text-center' >No data found</div>;
        }

        return (
            <div>
                <h2 className='myHeading'>Category list</h2>
                <div className='categoryListDiv'>
                    <ul>
                        {this.state.categories.map((category) => (
                            <li key={category._id} className='text-center' >
                                <Link to={`/category/${category.name}`} className='btn btn-primary btnLink mb-3' >{category.name}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
                
            </div>
        )
    }
}
