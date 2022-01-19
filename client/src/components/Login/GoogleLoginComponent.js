import React, { Component } from 'react'
import { GoogleLogin } from 'react-google-login';
import axios from 'axios';

//Config
import { config } from "../../config.js";
const configData = config();
const domain_url = configData.EXPRESS_JS_SERVER_URL


export default class GoogleLoginComponent extends Component {




    responseGoogleSuccess = (response) => {

        const info_div = document.getElementById('info_div')
        info_div.innerHTML = "Logging in..Please wait.."


        var form_data = {
            idToken: response.tokenId,
            googleId: response.profileObj.googleId,
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
            //credentials: 'include',


            withCredentials: true,
        }

        const url = domain_url + "/api/auth/login/login_type/google";
        axios.post(url, form_data, headers)
            .then(response => {


                info_div.innerHTML = response.data.message;
                //submit_button.disabled = false;

                const status = response.data.status;
                if (status === 200) {

                    this.setState({
                        loggedIn: true,
                    })

                    //Passes the loggedInfo to the parent component state. 
                    this.props.loginHandler();



                }




            })
            .catch(error => {

                info_div.innerHTML = "Error occured while loggin in";
                //submit_button.disabled = false;
            })
    }

    responseGoogleFailure = (response) => {
        const info_div = document.getElementById('info_div')
        info_div.innerHTML = "Login failed";

        const error = response.error

        if (error === 'idpiframe_initialization_failed') {

            info_div.innerHTML = "Login failed. Please enable 3rd party cookies to login.";
        }
        else if (error === 'popup_closed_by_user') {
            info_div.innerHTML = "Login failed. Please don't close the popup before the login is completed.";
        }

    }



    render() {

        return (
            <div>
                <GoogleLogin
                    clientId={process.env.REACT_APP_GOOGLE_SIGNUP_CLIENT_ID}
                    buttonText="Login with Google"
                    onSuccess={this.responseGoogleSuccess}
                    onFailure={this.responseGoogleFailure}
                    cookiePolicy={'single_host_origin'}

                    render={renderProps => (



                        <button onClick={renderProps.onClick} type="button" id="googleLoginButton" >

                            <div id="googleLoginSvg">
                                <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                                    <g fill="#000" fillRule="evenodd">
                                        <path d="M9 3.48c1.69 0 2.83.73 3.48 1.34l2.54-2.48C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.96l2.91 2.26C4.6 5.05 6.62 3.48 9 3.48z" fill="#EA4335"></path>
                                        <path d="M17.64 9.2c0-.74-.06-1.28-.19-1.84H9v3.34h4.96c-.1.83-.64 2.08-1.84 2.92l2.84 2.2c1.7-1.57 2.68-3.88 2.68-6.62z" fill="#4285F4"></path>
                                        <path d="M3.88 10.78A5.54 5.54 0 0 1 3.58 9c0-.62.11-1.22.29-1.78L.96 4.96A9.008 9.008 0 0 0 0 9c0 1.45.35 2.82.96 4.04l2.92-2.26z" fill="#FBBC05"></path>
                                        <path d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.84-2.2c-.76.53-1.78.9-3.12.9-2.38 0-4.4-1.57-5.12-3.74L.97 13.04C2.45 15.98 5.48 18 9 18z" fill="#34A853"></path>
                                        <path fill="none" d="M0 0h18v18H0z"></path>
                                    </g>
                                </svg>
                            </div>

                            <span id="googleLoginText">Log in with Google</span>

                        </button>
                    )}

                />

                <div id='info_div' className='text-center'></div>

            </div>
        )
    }
}
