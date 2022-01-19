import React, { Component } from 'react'
import { BrowserRouter as Switch, Link } from "react-router-dom";
import Loading from '../Loading';
import { Redirect } from 'react-router-dom'

import { getCookie } from "../../functions/getCookie"
import axios from 'axios';

//Config
import { config } from "../../config.js";
import { Navbar, Container, Nav } from 'react-bootstrap';
const configData = config();
const domain_url = configData.EXPRESS_JS_SERVER_URL


export default class AdminHeader extends Component {

    constructor(props) {
        super(props);


        this.adminLogout = this.adminLogout.bind(this);

        this.state = {
            title: 'CMS',
            loggedIn: this.props.loggedIn
        };
    }

    async componentDidMount() {

        //Remove footer if present
        /*
        const footer = document.getElementById('footer');
        if(footer !== null){
            footer.remove();
        }
        */



        if (getCookie('admin') && getCookie("admin") === 'true' && getCookie("loggedIn") === "true") {
            this.setState({
                loggedIn: true
            });
        }
    }

    componentDidUpdate(prevProps) {
        if ((this.props.loggedIn !== prevProps.loggedIn)) {


            this.setState({
                loggedIn: this.props.loggedIn
            })

        }
    }

    async adminLogout() {
        this.setState({
            loggedIn: false
        })

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
        const url = domain_url + "/api/auth/logout"

        axios.get(url, headers)
            .then(response => {


                if (response.status === 200) {
                    this.setState({
                        loggedIn: false,
                        loading: false,
                        data: response.data,
                    })
                }
            })
            .catch(error => {
                console.log("error in login axios from header")
                console.log(error);

            })

        this.props.logoutaction();
    }

    render() {

        if (this.state.loggedIn === false || !getCookie('admin')) {
            <Redirect to='/admin/login' />
        }



        return (
            <div id='adminHeader'>
                {this.state.loggedIn === false && !getCookie("admin") ? <Redirect to='/admin/login' /> : null}
                <header id='header'>


                    {this.state.loggedIn === true || getCookie("admin") ?
                        <>

                            <h2 className='myHeading'>Admin panel</h2>
                            <div>
                                <Navbar expand="md" style={{ "background": "white" }} className='fixed-top'>
                                    <Container>
                                        <Navbar.Brand href="">
                                            {this.props.titleData === undefined ?
                                                <><Loading /></>
                                                :


                                                <>

                                                    <a href='/'><h1>{this.props.titleData.fetched ? <> {this.props.titleData.titleAbbreviation}</> : <>{this.state.title}</>}</h1></a>

                                                </>
                                            }
                                        </Navbar.Brand>
                                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                                        <Navbar.Collapse id="basic-navbar-nav">

                                            <Nav className="me-auto">
                                                <Link className="nav-link" to="/admin">Home</Link>
                                                {getCookie('admin') ?
                                                    <>
                                                        <button className='btn btn-primary' onClick={this.adminLogout}>Logout</button>
                                                    </>
                                                    :
                                                    <></>
                                                }
                                            </Nav>
                                        </Navbar.Collapse>

                                    </Container>
                                </Navbar>
                            </div>
                            <hr />
                        </>

                        :
                        <></>
                    }

                </header>
            </div>
        )
    }
}
