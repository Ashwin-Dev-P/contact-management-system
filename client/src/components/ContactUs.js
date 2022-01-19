import React, { Component } from "react";
import { Row, Col } from "react-bootstrap";
import axios from "axios";

import Button from "./Button";

//Config
import { config } from "../config.js";
const configData = config();
const domain_url = configData.EXPRESS_JS_SERVER_URL;

export default class ContactUs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      message: "",
      error: false,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.changeHandler = this.changeHandler.bind(this);
    this.validation = this.validation.bind(this);
  }

  async validation() {
    var name = this.state.name;
    var message = this.state.message;

    if (!name || name.trim().length < 1) {
      this.setState({
        error: true,
        info_message: "Please enter your name",
      });
      return false;
    }

    if (!message || message.trim().length < 1) {
      this.setState({
        error: true,
        info_message: "Please enter your message",
      });
      return false;
    }
    return true;
  }

  async submitData() {
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

    const url = domain_url + "/api/contact";
    const form_data = {
      name: this.state.name.trim(),
      message: this.state.message.trim(),
    };

    axios
      .post(url, form_data, headers)
      .then((response) => {
        const status = response.data.status;
        if (status === 200) {
          this.setState({
            info_message: response.data.message,
            success: true,
            error: false,
          });
        }

        this.setState({
          submitting: false,
        });
      })
      .catch((error) => {
        this.setState({
          submitting: false,
          error: true,
          info_message: "Some error occured. Unable to send message",
        });
        console.log(error);
      });
  }

  async handleSubmit(e) {
    e.preventDefault();

    this.setState({
      submitting: true,
    });

    var valid = await this.validation();
    if (!valid) {
      this.setState({
        submitting: false,
      });
      return false;
    }

    await this.submitData();
  }

  async changeHandler(e) {
    const name = e.target.name;
    this.setState({
      [name]: e.target.value,
    });
  }

  render() {
    return (
      <div className="LoginWholeComponent">
        <Row>
          <Col md={2} lg={3}></Col>
          <Col xs={12} md={8} lg={6} id="contactUsForm" className=" myBorder">
            <h2 className="myHeading">Contact us</h2>
            <form onSubmit={this.handleSubmit}>
              <div className="form-group">
                <input
                  className="form-control mb-3 mt-3"
                  placeholder="Name"
                  type="text"
                  name="name"
                  id="name"
                  value={this.state.name}
                  onChange={this.changeHandler}
                  autoFocus
                />
              </div>

              <textarea
                rows="8"
                className="form-control mb-3 mt-3"
                placeholder="Type your message here..."
                name="message"
                id="message"
                value={this.state.message}
                onChange={this.changeHandler}
              />

              {this.state.submitting ? (
                <div>
                  <Button
                    className="btn-primary"
                    text="Submit"
                    type="submit"
                    disabled={true}
                    loading={true}
                  />
                </div>
              ) : (
                <div>
                  <Button className="btn-primary" text="Submit" type="submit" />
                </div>
              )}

              {this.state.error ? (
                <div className="error-div text-center mt-3 mb-3">
                  {this.state.info_message}
                </div>
              ) : null}

              {this.state.success ? (
                <div className="success-div text-center mt-3 mb-3">
                  {this.state.info_message}
                </div>
              ) : null}
            </form>
          </Col>
        </Row>
      </div>
    );
  }
}
