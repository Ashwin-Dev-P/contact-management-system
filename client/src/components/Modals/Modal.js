import React, { Component } from "react";
import axios from "axios";
import Button from "../Button";

//import functions
import { deleteCookie } from "../../functions/deleteCookie";

//Config
import { config } from "../../config.js";
import { Col, Row } from "react-bootstrap";

const configData = config();
const domain_url = configData.EXPRESS_JS_SERVER_URL;

export default class Modal extends Component {
  constructor(props) {
    super(props);

    this.deleteAccount = this.deleteAccount.bind(this);
    this.state = {};
  }

  async deleteAccount() {
    this.setState({
      show: false,
    });

    var info_div = document.getElementById("info_div");
    info_div.innerHTML = "Deleting account..please wait";

    var delete_button = document.getElementById("delete_button");
    delete_button.disabled = true;
    var form_data = {};

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

    var url = domain_url + "/api/member";

    axios
      .delete(url, headers, form_data)
      .then((response) => {
        info_div.innerHTML = response.data.message;
        delete_button.disabled = false;

        const status = response.data.status;
        if (status === 200) {
          //logout
          deleteCookie("loggedIn");
          this.setState({
            loggedIn: false,
          });

          this.props.logout();
        }
      })
      .catch((error) => {
        console.log(error);
        info_div.innerHTML = "Unable to delete account";
        delete_button.disabled = false;
      });
  }
  render() {
    var showHideClassName;
    if (this.state.show === false) {
      showHideClassName = "modal display-none";
    } else {
      showHideClassName = this.props.show
        ? "modal display-block"
        : "modal display-none";
    }

    const handleClose = this.props.handleClose;
    return (
      <div className={showHideClassName}>
        <section className="modal-main">
          <button
            type="button"
            class="btn-close"
            style={{ float: "right" }}
            aria-label="Close"
            onClick={handleClose}
          ></button>
          <div className="modal-content">
            Are you sure you want to delete your account?
            <Row className="mt-3">
              <Col>
                <Button
                  className="btn-danger"
                  text="Yes"
                  onClick={this.deleteAccount}
                  id="delete_button"
                />
              </Col>
              <Col>
                <Button
                  className="cancel-btn"
                  text="Cancel"
                  onClick={handleClose}
                />
              </Col>
            </Row>
          </div>
        </section>
      </div>
    );
  }
}
