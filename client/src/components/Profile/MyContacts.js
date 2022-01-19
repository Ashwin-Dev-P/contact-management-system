import React, { Component } from "react";
import Loading from "../Loading";
import { BrowserRouter as Switch, Link } from "react-router-dom";
import Person from "../Person";

import axios from "axios";

import { getCookie } from "../../functions/getCookie";

//Config
import { config } from "../../config.js";
import { Redirect } from "react-router";
import { Col, Row } from "react-bootstrap";
const configData = config();
const domain_url = configData.EXPRESS_JS_SERVER_URL;

export default class MyContacts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      loggedIn: false,
    };
  }
  async componentDidMount() {
    if (getCookie("loggedIn") !== "true") {
      const redirectUrl = "/login?redirectUrl=/my_contacts/";
      this.setState({
        redirectUrl: redirectUrl,
        loggedIn: false,
      });

      return false;
    }
    this.setState({
      loggedIn: true,
    });
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
    const url = domain_url + "/api/member/contacts";

    axios
      .get(url, headers)
      .then((response) => {
        if (response.status === 200) {
          this.setState({
            loading: false,
            data: response.data.contacts,
          });
        }
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          loading: false,
          error: true,
        });
      });
  }
  render() {
    if (this.state.redirectUrl && this.state.loggedIn === false) {
      const path = this.state.redirectUrl;
      return <Redirect to={path} />;
    }
    return (
      <div>
        <h2 class="myHeading">My Contacts</h2>
        {this.state.loading === true ? (
          <Loading />
        ) : (
          <>
            <div>
              {this.state.error ? (
                <>Couldn't fetch data</>
              ) : (
                <>
                  {this.state.data && this.state.data.length > 0 ? (
                    <>
                      <ul>
                        <Row>
                          {this.state.data.map((datum) => (
                            <Col
                              key={datum._id}
                              xs={12}
                              md={6}
                              lg={4}
                              xl={3}
                              className="zoomOnHover"
                            >
                              <Person
                                username={datum.username}
                                _id={datum._id}
                                profilePictureUrl={datum.profilePictureUrl}
                                signInType={datum.signInType}
                              />
                            </Col>
                          ))}
                        </Row>
                      </ul>
                    </>
                  ) : (
                    <>
                      No contacts found. <Link to="/search">Search</Link> to
                      find people you may know.
                    </>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </div>
    );
  }
}
