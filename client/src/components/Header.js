import React, { Component } from "react";
import { BrowserRouter as Switch, Link } from "react-router-dom";
import Loading from "./Loading";

import { getCookie } from "../functions/getCookie";
import { deleteCookie } from "../functions/deleteCookie";

import axios from "axios";

import { Container, Navbar, Nav, NavDropdown } from "react-bootstrap";
//Config
import { config } from "../config.js";
const configData = config();
const domain_url = configData.EXPRESS_JS_SERVER_URL;

export default class Header extends Component {
  constructor(props) {
    super(props);

    this.logout = this.logout.bind(this);
    this.verifyLogin = this.verifyLogin.bind(this);
    this.state = {
      title: "CMS",
      loading: true,
      loggedIn: this.props.loggedIn,
    };
  }

  //Get profile details for the navbar and to verify login
  verifyLogin() {
    //basic api authentication
    const username = process.env.REACT_APP_BASIC_AUTH_USERNAME;
    const password = process.env.REACT_APP_BASIC_AUTH_PASSWORD;

    //STARTS HERE

    const headers = {
      "Content-Type": "application/json",
      auth: {
        username: username,
        password: password,
      },
      credentials: "include",
      withCredentials: true,
    };
    const url = domain_url + "/api/auth/verify_token";

    axios
      .get(url, headers)
      .then((response) => {
        if (response.status === 200) {
          //If jwt is valid and logged in
          if (response.data.status === 200) {
            this.setState({
              username: response.data.doc.username || "N/A",
              loggedIn: true,
              loading: false,
              data: response.data,
            });
          }
          //If jwt is invalid
          else if (response.data.status === 401) {
            this.setState({
              loggedIn: false,
              loading: false,
              data: response.data,
            });

            //Logout since jwt is invalid
            this.logout();
          }

          //Some other unsuccessful status code
          else {
            this.setState({
              username: "N/A",
              loggedIn: true,
              loading: false,
              data: response.data,
            });

            //Logout since jwt is not success
            this.logout();
          }
        }
      })
      .catch((error) => {
        console.log("error in login axios from header");
        console.log(error);
      });
  }

  componentDidUpdate(prevProps) {
    if (this.props.loggedIn !== prevProps.loggedIn) {
      this.setState({
        loggedIn: this.props.loggedIn,
      });

      //If props change to loggedIn, then fetch the username from database.(The name is fetched only when the component is mounted so we are fetching name again)
      if (this.props.loggedIn) {
        this.setState({
          loading: true,
        });

        this.verifyLogin();
      }
    }
  }

  async componentDidMount() {
    const loggedInCookie = getCookie("loggedIn");

    if (loggedInCookie === null || loggedInCookie === undefined) {
      this.setState({
        loading: false,
        loggedIn: false,
      });
      return false;
    }

    this.verifyLogin();
  }

  //Used to set the loogedIn state of the parent component to false
  logout() {
    deleteCookie("loggedIn");
    deleteCookie("admin");
    //STARTS HERE

    //basic api authentication
    const username = process.env.REACT_APP_BASIC_AUTH_USERNAME;
    const password = process.env.REACT_APP_BASIC_AUTH_PASSWORD;

    const headers = {
      "Content-Type": "application/json",
      auth: {
        username: username,
        password: password,
      },
      credentials: "include",
      withCredentials: true,
    };
    const url = domain_url + "/api/auth/logout";

    axios
      .get(url, headers)
      .then((response) => {
        if (response.status === 200) {
          this.setState({
            loggedIn: false,
            loading: false,
            data: response.data,
          });
        }
      })
      .catch((error) => {
        console.log("error in login axios from header");
        console.log(error);
      });

    this.setState({
      loggedIn: false,
    });

    this.props.logoutaction();
  }

  //BIG BUG
  //{this.state.loggedIn === false ? <Redirect to='/' /> : <></>}
  render() {
    return (
      <div className="">
        <header id="header">
          <div>
            <Navbar
              expand="md"
              style={{ background: "white" }}
              className="fixed-top"
            >
              <Container>
                <Navbar.Brand href="">
                  {this.props.titleData === undefined ? (
                    <>
                      <Loading />
                    </>
                  ) : (
                    <>
                      <a id="myNavBarBrand" href="/">
                        <h1>
                          {this.props.titleData.fetched ? (
                            <> {this.props.titleData.titleAbbreviation}</>
                          ) : (
                            <>{this.state.title}</>
                          )}
                        </h1>
                      </a>
                    </>
                  )}
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                  <Nav className="me-auto">
                    <Link className="nav-link" to="/">
                      Home
                    </Link>
                    <Link className="nav-link" to="/contact_us">
                      contact us
                    </Link>
                    <Link className="nav-link" to="/about_us">
                      about us
                    </Link>
                    <Link className="nav-link" to="/search">
                      search
                    </Link>

                    {this.state.loading ? (
                      <>
                        {" "}
                        <span className="navbar-brand">
                          <Loading />
                        </span>{" "}
                      </>
                    ) : (
                      <>
                        {this.state.loggedIn ? (
                          <>
                            <NavDropdown
                              title={this.state.username}
                              id="basic-nav-dropdown"
                            >
                              <Link className="nav-link" to="/my_profile">
                                My Profile
                              </Link>

                              <Link className="nav-link" to="/settings">
                                Settings
                              </Link>

                              <Link className="nav-link" to="/my_contacts">
                                My contacts
                              </Link>

                              {getCookie("loggedIn") && getCookie("admin") ? (
                                <>
                                  <Link className="nav-link" to="/admin">
                                    Admin panel
                                  </Link>
                                </>
                              ) : null}

                              <NavDropdown.Divider />

                              <span
                                className="nav-link"
                                onClick={() => {
                                  this.logout();
                                }}
                              >
                                Logout
                              </span>
                            </NavDropdown>
                          </>
                        ) : (
                          <>
                            <Link className="nav-link" to="/login">
                              login
                            </Link>
                          </>
                        )}
                      </>
                    )}
                  </Nav>
                </Navbar.Collapse>
              </Container>
            </Navbar>
          </div>
        </header>
      </div>
    );
  }
}
