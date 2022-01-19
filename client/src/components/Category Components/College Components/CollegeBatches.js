import React, { Component } from 'react'
import { BrowserRouter as     Route, Link} from "react-router-dom";

//Config
import { config } from "../../../config.js";
import Loading from '../../Loading.js';
const configData = config();
const domain_url = configData.EXPRESS_JS_SERVER_URL

export default class CollegeBatches extends Component {

    state = {
        loading: true,
        batches: null,
      };
    
    async componentDidMount() {
    const college_id = this.props.match.params.college_id
        
    const base_url = domain_url + "/api/batch/college/";
    var url = base_url + college_id;

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
    this.setState({ batches: data, loading: false });
    }


    render() {

        if (this.state.loading) {
            return <div className='text-center' ><Loading /></div>;
        }
    
        if (!this.state.batches) {
            return <div className='text-center' >No batch found</div>;
        }

        if (this.state.batches.length === 0 ) {
            return <div className='text-center' >No batch is available</div>;
        }
        if (this.state.batches.length === 1 ) {
            return <div>
                
                <h2 className='myHeading'>Batches</h2>
                
                <div className='text-center' >
                
                    <Link to={`/college/${this.props.match.params.college_id}/batch/${this.state.batches[0]._id}`}  className='btn btn-primary btnLink mb-3'  >{this.state.batches[0].starting_year}-{this.state.batches[0].pass_out_year}</Link>
                </div>
                </div>;
        }

        return (
            <div>
                <div>
                    <h2 className='myHeading'>Batches</h2>
                </div>
                <div>
                    <ul>
                        {this.state.batches.map((batch) => (
                            <li key={batch._id} className='text-center'  >
                                <Link to={`/college/${this.props.match.params.college_id}/batch/${batch._id}`}  className='btn btn-primary btnLink mb-3'  >{batch.starting_year}-{batch.pass_out_year}</Link>
                            </li>
                        ))}

                    </ul>
                </div>
            </div>
        )
    }
}
