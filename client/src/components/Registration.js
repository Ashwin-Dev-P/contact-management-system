import React, { Component } from "react";
import axios from "axios";
import validator from "validator";

import { Redirect } from "react-router";

//Components
import Button from "./Button";
import GoogleSignUp from "./Register/GoogleSignUp";
import FacebookSignUp from "./Register/FaceBookSignUp";

//CSS
import { Row, Col } from "react-bootstrap";

//import functions
import { getCookie } from "../functions/getCookie";

//Config
import { config } from "../config.js";
import { Link } from "react-router-dom";
const configData = config();
const domain_url = configData.EXPRESS_JS_SERVER_URL;

const SITE_KEY = process.env.REACT_APP_SITE_KEY;

export default class Registration extends Component {
  constructor(props) {
    super(props);

    this.changeHandler = this.changeHandler.bind(this);

    this.submitHandler = this.submitHandler.bind(this);
    //this.submitData = this.submitData.bind(this);

    this.state = {};
  }

  async changeHandler(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  async submitData(submit_button, info_div) {
    window.grecaptcha.ready(() => {
      window.grecaptcha
        .execute(SITE_KEY, { action: "submit" })
        .then((token) => {
          if (!token) {
            info_div.innerHTML = "reCAPTCHA error";
            submit_button.disabled = false;
            return false;
          }

          const tokenRecieved = token;

          this.setState({
            reCAPTCHAToken: tokenRecieved,
          });

          //basic api authentication
          var username = process.env.REACT_APP_BASIC_AUTH_USERNAME;
          var password = process.env.REACT_APP_BASIC_AUTH_PASSWORD;

          const headers = {
            "Content-Type": "application/json",
            auth: {
              username: username,
              password: password,
            },
            //credentials: 'include',
            withCredentials: true,
          };

          const url = domain_url + "/api/member/basic_registration";
          axios
            .post(url, this.state, headers)
            .then((response) => {
              info_div.innerHTML = response.data.message;
              submit_button.disabled = false;

              if (response.data.status === 200) {
                console.log("before login handler");
                this.props.loginAction();
                this.setState({
                  registered: true,
                });
              }
            })
            .catch((error) => {
              console.log("error message", error);
              info_div.innerHTML =
                "Unable to register.Please contact us for details.";
              submit_button.disabled = false;
            });
        });
    });
  }

  async submitHandler(e) {
    e.preventDefault();

    //Disable submit button in the mean time
    var submit_button = document.getElementById("submit");
    submit_button.disabled = true;

    //Info div
    var info_div = document.getElementById("info");
    info_div.innerHTML = "Registering..Please wait...";

    //Validation
    //Email
    const email = document.getElementById("email").value.trim();
    if (email.length < 1) {
      info_div.innerHTML = "Please enter an email id";
      submit_button.disabled = false;
      return true;
    }

    if (!validator.isEmail(email)) {
      info_div.innerHTML = "Enter a valid additional email";
      submit_button.disabled = false;
      return true;
    }

    //Validate password
    const password = document.getElementById("password").value.trim();
    const password_confirmation = document
      .getElementById("passwordConfirmation")
      .value.trim();
    if (password.length < 1) {
      info_div.innerHTML = "Please enter a password";
      submit_button.disabled = false;
      return true;
    } else if (password_confirmation.length < 1) {
      info_div.innerHTML = "Please confirm your password";
      submit_button.disabled = false;
      return true;
    } else if (password !== password_confirmation) {
      info_div.innerHTML = "Both the passwords do not match";
      submit_button.disabled = false;
      return true;
    }

    //Username
    const username = document.getElementById("username").value.trim();
    if (username.length < 1) {
      info_div.innerHTML = "Please enter a username";
      submit_button.disabled = false;
      return false;
    } else if (!/^[a-zA-Z0-9]+$/.test(username)) {
      info_div.innerHTML = "Username must contain only alphabets and numbers";
      submit_button.disabled = false;
      return false;
    }

    //FirstName
    const firstName = document.getElementById("firstName").value.trim();
    if (firstName.length < 1) {
      info_div.innerHTML = "Please enter your first name";
      submit_button.disabled = false;
      return false;
    } else if (!/^[a-zA-Z\s]+$/.test(firstName)) {
      info_div.innerHTML =
        "First name must contain only alphabets and white spaces";
      submit_button.disabled = false;
      return false;
    }

    //middle Name
    const middleName = document.getElementById("middleName").value.trim();
    if (middleName.length > 0 && !/^[a-zA-Z\s]+$/.test(middleName)) {
      info_div.innerHTML =
        "Middle name must contain only alphabets and white spaces";
      submit_button.disabled = false;
      return false;
    }

    //LastName
    const lastName = document.getElementById("lastName").value.trim();
    if (lastName.length < 1) {
      info_div.innerHTML = "Please enter your last name";
      submit_button.disabled = false;
      return false;
    } else if (!/^[a-zA-Z\s]+$/.test(lastName)) {
      info_div.innerHTML =
        "Last name must contain only alphabets and white spaces";
      submit_button.disabled = false;
      return false;
    }

    this.submitData(submit_button, info_div);
  }

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
              {this.state.registered === true ? (
                <>
                  <Redirect to="/account/select_account_type" />
                </>
              ) : (
                <></>
              )}
              <h2 className="myHeading">Sign Up</h2>
              <form onSubmit={this.submitHandler}>
                <input
                  class="form-control"
                  placeholder="email"
                  type="email"
                  id="email"
                  name="email"
                  onChange={this.changeHandler}
                  autoFocus
                  autoComplete="on"
                />
                <br />

                <input
                  class="form-control"
                  placeholder="password"
                  type="password"
                  id="password"
                  name="password"
                  onChange={this.changeHandler}
                  autoComplete="new-password"
                />
                <br />

                <input
                  class="form-control"
                  placeholder="password confirmation"
                  type="password"
                  id="passwordConfirmation"
                  name="passwordConfirmation"
                  onChange={this.changeHandler}
                  autoComplete="new-password"
                />
                <br />

                <input
                  class="form-control"
                  placeholder="username"
                  type="text"
                  id="username"
                  name="username"
                  onChange={this.changeHandler}
                  autoComplete="username"
                />
                <br />

                <input
                  class="form-control"
                  placeholder="first name"
                  type="text"
                  id="firstName"
                  name="firstName"
                  onChange={this.changeHandler}
                />
                <br />

                <input
                  class="form-control"
                  placeholder="middle name"
                  type="text"
                  id="middleName"
                  name="middleName"
                  onChange={this.changeHandler}
                />
                <br />

                <input
                  class="form-control"
                  placeholder="last name"
                  type="text"
                  id="lastName"
                  name="lastName"
                  onChange={this.changeHandler}
                />
                <br />

                <Button
                  className="btn-primary"
                  text={"Sign Up"}
                  id={"submit"}
                ></Button>
              </form>

              <hr />
              <div className="otherSignInOptionsDiv">
                <GoogleSignUp loginHandler={this.props.loginAction} />
                <FacebookSignUp loginHandler={this.props.loginAction} />
              </div>

              <div id="info"></div>
            </div>
          </Col>
        </Row>

        <Row>
          <Col md={3} lg={4}></Col>
          <Col xs={12} md={6} lg={4} className="">
            <div className="signUpSuggestionDiv myBorder">
              Already have an account? <Link to="/login">login</Link>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
