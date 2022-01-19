import React, { Component } from 'react'

import axios from 'axios';

import Loading from './Loading';
import Email from './Member Detail Components/Email';
import ContactNumber from './Member Detail Components/ContactNumber';
import SocialMedia from './Member Detail Components/SocialMedia';
import EditAccountType from './Profile/EditAccountType';



//Config
import { config } from "../config.js";

//import functions
import { increaseGoogleProfilePictureSize } from '../functions/increaseGoogleProfilePictureSize'
import { getCookie } from '../functions/getCookie.js';

import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';
const configData = config();
const domain_url = configData.EXPRESS_JS_SERVER_URL


export default class MyProfile extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: true
        }
    }

    async componentDidMount() {

        if (!(getCookie("loggedIn") === 'true')) {

            const redirectUrl = "/login?redirectUrl=/my_profile";
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
        const url = domain_url + "/api/member/my_profile"

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

        if (!this.state.loading) {
            var profilePicture
            if (this.state.data.profilePictureUrl && this.state.data.signInType && this.state.data.signInType === 'google') {
                profilePicture = increaseGoogleProfilePictureSize(this.state.data.profilePictureUrl)
            }
            else {
                profilePicture = this.state.data.profilePictureUrl || "https://cdn.iconscout.com/icon/free/png-256/account-avatar-profile-human-man-user-30448.png";

            }

        }
        return (
            <Row>

                <Col xs={12} md={2} lg={3}>
                </Col>

                <Col xs={12} md={8} lg={6} className='myDiv myBorder' >
                    <div>
                        <div>
                            <h2 className='myHeading '>My Profile</h2><hr />
                            <div>
                                {this.state.loading ? <> <Loading /> </> :
                                    <>
                                        <div>
                                            <div>
                                                <h3 className='text-center'>Basic details</h3>
                                                <div>
                                                    <h4>Profile picture</h4>
                                                    <img src={profilePicture} alt="profile picture" width="100" height="100" />
                                                </div>
                                                <div>
                                                    Username:
                                                    {this.state.data.username

                                                        ?
                                                        <div>
                                                            {this.state.data.username}
                                                        </div>
                                                        :
                                                        <div>
                                                            N/A
                                                        </div>

                                                    }
                                                </div><br />

                                                <div>
                                                    First name:
                                                    {this.state.data.first_name

                                                        ?
                                                        <div>
                                                            {this.state.data.first_name}
                                                        </div>
                                                        :
                                                        <div>
                                                            N/A
                                                        </div>

                                                    }
                                                </div><br />

                                                <div>
                                                    Middle name:
                                                    {this.state.data.middle_name

                                                        ?
                                                        <div>
                                                            {this.state.data.middle_name}
                                                        </div>
                                                        :
                                                        <div>
                                                            N/A
                                                        </div>

                                                    }
                                                </div><br />


                                                <div>
                                                    Last name:
                                                    {this.state.data.last_name

                                                        ?
                                                        <div>
                                                            {this.state.data.last_name}
                                                        </div>
                                                        :
                                                        <div>
                                                            N/A
                                                        </div>

                                                    }
                                                </div><br />
                                                <div className='text-center'>
                                                    <Link className='btn btn-primary' to="/account/edit_basic_details/" >Edit basic details</Link>
                                                </div>
                                            </div><hr />




                                            <div>
                                                <h3 className='text-center'>Contact details</h3>
                                                <div>
                                                    <Email email={this.state.data.email} /><br />
                                                </div>
                                                <div>
                                                    <ContactNumber contact_number={this.state.data.contact_number} /><br />
                                                </div>

                                                <div>
                                                    {this.state.data.social_media !== undefined ?
                                                        <><SocialMedia social_media={this.state.data.social_media} /><br /></>
                                                        :
                                                        <></>
                                                    }
                                                </div>
                                                <div className='text-center'>
                                                    <Link className='btn btn-primary' to="/account/edit_contact_details/" >Edit contact details</Link>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                }
                            </div>

                            <hr />
                        </div>
                        <EditAccountType />
                    </div>
                </Col>

            </Row>
        )
    }
}
