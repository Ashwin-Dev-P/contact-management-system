import React, { Component } from 'react'
import FacebookLogin from 'react-facebook-login';
import axios from 'axios';

//Config
import { config } from "../../config.js";
const configData = config();
const domain_url = configData.EXPRESS_JS_SERVER_URL

export default class FacebookLoginComponent extends Component {

    constructor(props){
        super(props)
        this.responseFacebook = this.responseFacebook.bind(this);
        
    }

    responseFacebook(response){
        const info_div = document.getElementById('info_div')

        if(!response.accessToken || !response.userID || !response.picture.data.url){
            info_div.innerHTML = "Login failed. Please try again";
            return false;
        }

        info_div.innerHTML = "Logging in..Please wait.."


        var form_data = {
            accessToken:  response.accessToken,
            userID: response.userID,
            picture: response.picture.data.url,
        }
        
        //basic api authentication
        const username = process.env.REACT_APP_BASIC_AUTH_USERNAME ;
        const password = process.env.REACT_APP_BASIC_AUTH_PASSWORD;

        const headers = {
            'Content-Type': 'application/json',
            auth: {
                username: username ,
                password: password
            },
            withCredentials: true,
        }

        const url= domain_url + "/api/auth/login/login_type/facebook";
        axios.post(url,form_data, headers)
        .then(response => {
            
           
            info_div.innerHTML = response.data.message;
            //submit_button.disabled = false;

            const status = response.data.status;
            if(status === 200){

                this.setState({
                    loggedIn: true,
                })
                
                //Passes the loggedInfo to the parent component state. 
                this.props.loginHandler();


                
            }
            
            

            
        })
        .catch(error => {
            console.log(error)
            info_div.innerHTML = "Error occured while loggin in" ;
            
        })

    }

    render() {
        return (
            <div>
                
                <FacebookLogin
                    appId={ process.env.NODE_ENV === 'development' ?   process.env.REACT_APP_FACEBOOK_TEST_APP_ID : process.env.REACT_APP_FACEBOOK_APP_ID }
                    autoLoad={false}
                    fields="name,email,picture"
                    
                    callback={this.responseFacebook} 

                    textButton = "Log in with Facebook"  
                    cssClass=" btnFacebook"

                    
                        


                        
                />
                <div id='info_div'></div>
            </div>
        )
    }
}
