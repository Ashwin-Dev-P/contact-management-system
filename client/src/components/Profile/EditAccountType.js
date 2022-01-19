import React, { Component } from 'react'

import axios from 'axios';
import Loading from '../Loading.js';

//Config
import { config } from "../../config.js";
import { getCookie } from '../../functions/getCookie';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
const configData = config();
const domain_url = configData.EXPRESS_JS_SERVER_URL

export default class EditAccountType extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: true
        }
    }

    async componentDidMount() {
        if (!(getCookie("loggedIn") === 'true')) {

            const redirectUrl = "/login?redirectUrl=/account/account_type";
            this.setState({
                redirectUrl: redirectUrl
            });
            return false;
        }

        //basic api authentication
        const username = process.env.REACT_APP_BASIC_AUTH_USERNAME;
        const password = process.env.REACT_APP_BASIC_AUTH_PASSWORD;



        const headers = {
            'Content-Type': 'application/json',
            auth: {
                username: username,
                password: password
            },
            credentials: 'include',
            withCredentials: true,
        }
        const url = domain_url + "/api/member/account_type"

        axios.get(url, headers)
            .then(response => {
                if (response.status === 200) {
                    this.setState({


                        data: response.data.data,
                    })


                }

                this.setState({
                    loading: false
                });
            })
            .catch(error => {
                this.setState({
                    loading: false,
                })
                console.log(error);

            })

    }
    render() {

        if (this.state.redirectUrl) {
            return <Redirect to={this.state.redirectUrl} />
        }

        return (
            <div>
                <h3 className='text-center'>Account type</h3>

                <div>
                    {this.state.loading === true ? <Loading /> :
                        <>{this.state.data.type === undefined ?
                            <>
                                <div>
                                    Account type not yet set   <br />
                                    <Link to='/account/select_account_type'>Set account type</Link>
                                </div>


                            </>
                            :
                            <>
                                {this.state.data.type.name === 'college' ?
                                    <>
                                        <div>
                                            Type: {this.state.data.type.name}
                                            <div>

                                                College name: {this.state.data.college_student_details.college_id.name}
                                            </div>
                                            <div>
                                                Batch: {this.state.data.college_student_details.batch.starting_year}-{this.state.data.college_student_details.batch.pass_out_year}
                                            </div>
                                            <div>
                                                Department: {this.state.data.college_student_details.department.department_name.abbreviation}
                                            </div>
                                            <div>
                                                Section: {this.state.data.college_student_details.section_id.section_name}
                                            </div>
                                        </div>
                                    </>
                                    :
                                    <>
                                        {this.state.data.type.name === 'school' ?
                                            <>
                                                <div>
                                                    Type: {this.state.data.type.name}
                                                    <div>
                                                        School name: {this.state.data.school_student_details.school_id.name}
                                                    </div>
                                                </div>
                                            </>
                                            :
                                            <>
                                                {this.state.data.type.name === 'company' ?
                                                    <>
                                                        <div>
                                                            Type: {this.state.data.type.name}
                                                            <div>
                                                                Company name: {this.state.data.company_details ? this.state.data.company_details.company_id.name : null}
                                                            </div>
                                                        </div>
                                                    </>
                                                    :
                                                    <>
                                                        {this.state.data.type.name === 'general' ?
                                                            <>
                                                                <div className='text-center'>
                                                                    This is a general account
                                                                </div>
                                                            </>
                                                            :
                                                            <></>
                                                        }
                                                    </>
                                                }

                                            </>

                                        }

                                    </>
                                }

                                <div className='text-center mt-3'><Link className='btn btn-primary' to='/account/select_account_type'>Edit account type</Link></div>
                            </>
                        }</>
                    }
                </div>
            </div>
        )
    }
}
