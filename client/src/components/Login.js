import React, { Component } from "react";
import axios from "axios";
import { BrowserRouter as Switch, Link } from "react-router-dom";
//import Cookies from 'universal-cookie';

import { Redirect } from "react-router-dom";
import GoogleLoginComponent from "./Login/GoogleLoginComponent";
import FacebookLoginComponent from "./Login/FacebookLoginComponent";
import Loading from "./Loading";

//import functions
import { getCookie } from "../functions/getCookie";

//CSS
import { Row, Col } from "react-bootstrap";

//Config
import { config } from "../config.js";
const configData = config();
const domain_url = configData.EXPRESS_JS_SERVER_URL;

const SITE_KEY = process.env.REACT_APP_SITE_KEY;

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.changeHandler = this.changeHandler.bind(this);
    this.submitData = this.submitData.bind(this);
    this.submitHandler = this.submitHandler.bind(this);

    this.state = {
      admin: window.location.pathname === "/admin/login" ? true : false,
      loggingIn: false,
    };

    if (!(getCookie("loggedIn") === "true")) {
      this.props.logoutHandler();
    }
  }

  async componentDidMount() {}

  changeHandler = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  submitData = (submit_button, info_div, form_data) => {
    window.grecaptcha.ready(() => {
      window.grecaptcha
        .execute(SITE_KEY, { action: "submit" })
        .then((token) => {
          if (!token) {
            info_div.innerHTML = "reCAPTCHA error";
            submit_button.disabled = false;

            this.setState({
              loggingIn: false,
            });

            return false;
          }

          const tokenRecieved = token;
          form_data.reCAPTCHAToken = tokenRecieved;

          //basic api authentication
          const username = process.env.REACT_APP_BASIC_AUTH_USERNAME;
          const password = process.env.REACT_APP_BASIC_AUTH_PASSWORD;

          const headers = {
            "Content-Type": "application/json",
            auth: {
              username: username,
              password: password,
            },
            //credentials: 'include',

            withCredentials: true,
          };

          var match = this.props.match;
          var url;
          if (match !== undefined) {
            var admin = match.params.admin;
            if (admin && admin === "admin") {
              url = domain_url + "/api/auth/login/admin";
            } else {
              url = domain_url + "/api/auth/login/member";
            }
          } else {
            url = domain_url + "/api/auth/login/member";
          }

          axios
            .post(url, form_data, headers)
            .then((response) => {
              info_div.innerHTML = response.data.message;
              submit_button.disabled = false;

              const status = response.data.status;
              if (status === 200) {
                this.setState({
                  loggedIn: true,
                });

                //Passes the loggedInfo to the parent component state.
                this.props.loginHandler();
              }
            })
            .catch((error) => {
              info_div.innerHTML = "Error occured while loggin in";
              submit_button.disabled = false;
            });

          this.setState({
            loggingIn: false,
          });
        });
    });
  };

  submitHandler = (e) => {
    e.preventDefault();
    this.setState({
      loggingIn: true,
    });

    //Disable submit button in the mean time
    var submit_button = document.getElementById("login");
    submit_button.disabled = true;

    //Info div
    var info_div = document.getElementById("info");

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    if (email.length < 1) {
      info_div.innerHTML = "Please enter your email";
      submit_button.disabled = false;

      this.setState({
        loggingIn: false,
      });

      return false;
    } else if (password.length < 1) {
      info_div.innerHTML = "Please enter your password";
      submit_button.disabled = false;

      this.setState({
        loggingIn: false,
      });
      return false;
    }

    var form_data = {
      email: email,
      password: password,
    };
    this.submitData(submit_button, info_div, form_data);
  };
  render() {
    if (this.state.loggedIn || getCookie("loggedIn")) {
      //Get the redirect location to be sent to after logging in
      const queryParams = new URLSearchParams(window.location.search);
      var redirectUrl = queryParams.get("redirectUrl");
    }

    if ((this.state.loggedIn || getCookie("loggedIn")) && getCookie("admin")) {
      const path = redirectUrl;
      if (path) {
        return <Redirect to={path} />;
      }
      return <Redirect to="/admin" />;
    } else if (this.state.loggedIn || getCookie("loggedIn")) {
      const path = redirectUrl;
      if (path) {
        return <Redirect to={path} />;
      }
      return <Redirect to="/" />;
    }

    return (
      <div className="LoginWholeComponent">
        <Row>
          <Col md={3} lg={4}></Col>
          <Col xs={12} md={6} lg={4} className="">
            <div className="loginComponent myBorder">
              <div>
                <div>
                  <form method="post" onSubmit={this.submitHandler}>
                    <div className="form-group">
                      <input
                        className="form-control"
                        type="email"
                        id="email"
                        name="email"
                        placeholder="email"
                        required
                        onChange={this.changeHandler}
                        autoFocus
                      />
                    </div>

                    <div className="form-group">
                      <input
                        className="form-control"
                        type="password"
                        id="password"
                        name="password"
                        placeholder="password"
                        required
                        onChange={this.changeHandler}
                        autoComplete="on"
                      />
                      <br />
                    </div>

                    <button
                      id="login"
                      type="submit"
                      className="btn btn-primary"
                    >
                      {this.state.loggingIn === true ? (
                        <>
                          {" "}
                          <Loading />{" "}
                        </>
                      ) : (
                        <>Log In</>
                      )}
                    </button>
                  </form>
                </div>

                {this.state.admin !== true ? (
                  <>
                    <hr />
                    <div className="otherSignInOptionsDiv">
                      <GoogleLoginComponent
                        loginHandler={this.props.loginHandler}
                      />
                      <FacebookLoginComponent
                        loginHandler={this.props.loginHandler}
                      />
                    </div>
                  </>
                ) : null}

                <div id="info" className="text-center"></div>
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={3} lg={4}></Col>
          <Col xs={12} md={6} lg={4} className="">
            {this.state.admin ||
            (this.props.match && this.props.match.params.admin) ? null : (
              <>
                <div className="signUpSuggestionDiv myBorder">
                  Don't have an account? <Link to="register">Sign up</Link>
                </div>
              </>
            )}
          </Col>
        </Row>
      </div>
    );
  }
}
