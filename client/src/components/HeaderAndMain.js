import React, { Component } from 'react'

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import axios from 'axios';


//Admin
import AdminHeader from './Admin Components/AdminHeader';

//Navbar components
import Header from './Header';
import RoutesComponent from './RoutesComponent';

import Footer from './Footer'

import { getCookie } from '../functions/getCookie';

//Config
import { config } from "../config.js";
import { Container } from 'react-bootstrap';
const configData = config();
const domain_url = configData.EXPRESS_JS_SERVER_URL




//import MyDynamicApp from './MyDynamicApp';

export default class NavBar extends Component {
    constructor(props) {

        super(props);
        //this.handleChange = this.handleChange.bind(this);

        this.loginHandler = this.loginHandler.bind(this);
        this.logoutHandler = this.logoutHandler.bind(this);


        //Fetch the title from database
        this.state = {
            title: '',
            loading: true,
            admin: false,
            adminPath: false,
            footerSet: true,

        };
    }

    async componentDidMount() {
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

        const url = domain_url + "/api/singleton/title"



        axios.get(url, headers)
            .then(response => {


                if (response.status === 200 && response.headers['content-type'] === 'application/json; charset=utf-8') {

                    this.setState({
                        titleData: {
                            titleAbbreviation: response.data.title.abbreviation,
                            fetched: true,
                        },


                        loading: false
                    });

                }
                else {

                    this.setState({
                        titleData: {
                            fetched: false,
                        },
                        loading: false
                    });

                }



            })
            .catch(error => {

                this.setState({
                    titleData: {
                        fetched: false,
                    },
                    error: true,
                    loading: false
                });
            })

        if (getCookie("admin")) {
            this.setState({
                admin: true
            });
        }


        const path = window.location.pathname;
        if (path === 'admin' || path === 'admin/login') {

            this.setState({
                adminPath: true
            });
        } else {
            this.setState({
                adminPath: false
            });
        }



    }





    //Changes the loggedIn state of this Header Main component from the Routes component 
    loginHandler() {

        if (getCookie("admin")) {
            this.setState({
                admin: true
            });
        }

        this.setState({
            loggedIn: true
        })

    }


    logoutHandler() {

        this.setState({
            loggedIn: false,
            admin: false
        })

    }








    render() {


        const pathname = window.location.pathname;

        return (
            <>

                <Router>
                    {pathname === '/admin' || pathname === '/admin/login' || pathname === '/admin/singleton' ?
                        <>
                            <AdminHeader
                                titleData={this.state.titleData}
                                loggedIn={this.state.loggedIn}
                                logoutaction={this.logoutHandler}
                            />

                        </>
                        :
                        <>
                            <Header

                                titleData={this.state.titleData}

                                loggedIn={this.state.loggedIn}
                                logoutaction={this.logoutHandler}
                            />

                        </>
                    }

                    <Container>
                        <main className='main' id='main'>
                            <Switch>
                                <RoutesComponent loginHandler={this.loginHandler} logoutHandler={this.logoutHandler} loggedIn={this.state.loggedIn} />
                            </Switch>
                        </main>
                    </Container>
                </Router>

                {pathname === '/admin' || pathname === '/admin/login' || pathname === '/admin/singleton' || this.state.adminPath === true ? <></> : <><Footer /></>}

            </>

        )
    }
}




