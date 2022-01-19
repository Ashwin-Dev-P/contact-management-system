import React, { Component } from "react";
import Email from "./Email";
import ContactNumber from "./ContactNumber";
import SocialMedia from "./SocialMedia";
import Loading from "../Loading";

import axios from "axios";

//Config
import { config } from "../../config.js";
import { getCookie } from "../../functions/getCookie";
import { Redirect } from "react-router";
import { increaseGoogleProfilePictureSize } from "../../functions/increaseGoogleProfilePictureSize";
import { Card, Col, Row } from "react-bootstrap";
const configData = config();
const domain_url = configData.EXPRESS_JS_SERVER_URL;

export default class DetailedView extends Component {
  constructor(props) {
    super(props);

    this.addToContact = this.addToContact.bind(this);
    this.removeContact = this.removeContact.bind(this);
    this.state = {
      loading: true,
      additionalDataLoading: true,
      details: null,
      buttonDisabled: false,
      removing: false,
    };
  }

  async componentDidMount() {
    //Fetch the user data
    var base_url = domain_url + "/api/member/id/";
    var url = base_url + this.props.match.params.id;

    //basic api authentication
    const username = process.env.REACT_APP_BASIC_AUTH_USERNAME;
    const password = process.env.REACT_APP_BASIC_AUTH_PASSWORD;

    var response = await fetch(url, {
      method: "get",
      headers: new Headers({
        Authorization: "Basic " + btoa(username + ":" + password),
        "Content-Type": "application/x-www-form-urlencoded",
      }),
    });
    var data = await response.json();

    this.setState({ details: data });

    //Chack if logged in
    if (getCookie("loggedIn") === "true") {
      //Check if the member is already a contact
      const headers = {
        "Content-Type": "application/json",
        auth: {
          username: username,
          password: password,
        },
        //credentials: 'include',
        withCredentials: true,
      };

      base_url = domain_url + "/api/member/already_contact/id/";
      url = base_url + this.props.match.params.id;

      axios
        .get(url, headers)
        .then((response) => {
          if (response.status === 200 && response.data.status === 200) {
            this.setState({
              already_contact: true,
            });
          }

          this.setState({
            additionalDataLoading: false,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      this.setState({
        additionalDataLoading: false,
      });
    }
    this.setState({
      loading: false,
    });
  }

  async addToContact(id) {
    this.setState({
      buttonDisabled: true,
    });

    if (!(getCookie("loggedIn") === "true")) {
      const redirectUrl =
        "/login?redirectUrl=/details/" + this.props.match.params.id;
      this.setState({
        redirectUrl: redirectUrl,
      });
      return false;
    }

    //Adding to contact
    const base_url = domain_url + "/api/member/add_contact/id/";
    const url = base_url + id;

    //here
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

    axios
      .post(url, {}, headers)
      .then((response) => {
        if (response.status === 200 && response.data.status === 200) {
          this.setState({
            added: true,
          });
        }

        this.setState({
          loading: false,
          buttonDisabled: false,
        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          buttonDisabled: false,
          loading: false,
        });
      });
  }

  async removeContact(id) {
    this.setState({
      removing: true,
    });

    //Adding to contact
    const base_url = domain_url + "/api/member/remove_contact/id/";
    const url = base_url + id;

    //here
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

    axios
      .get(url, headers)
      .then((response) => {
        if (response.status === 200 && response.data.status === 200) {
          this.setState({
            removing: false,
            already_contact: false,
            added: false,
            buttonDisabled: false,
          });
          return true;
        }

        this.setState({
          removing: false,
        });
      })
      .catch((error) => {
        this.setState({
          removing: false,
          already_contact: true,
        });
      });
  }

  render() {
    if (this.state.redirectUrl) {
      return <Redirect to={this.state.redirectUrl} />;
    }
    if (this.state.loading) {
      return (
        <div className="text-center">
          {" "}
          <Loading />{" "}
        </div>
      );
    }

    if (!this.state.details) {
      return <div className="text-center">No data found</div>;
    }

    if (!this.state.loading && this.state.details) {
      var profilePicture;
      if (
        this.state.details.profilePictureUrl &&
        this.state.details.signInType &&
        this.state.details.signInType === "google"
      ) {
        profilePicture = increaseGoogleProfilePictureSize(
          this.state.details.profilePictureUrl
        );
      } else {
        profilePicture =
          "https://cdn.iconscout.com/icon/free/png-256/account-avatar-profile-human-man-user-30448.png";
      }
    }

    return (
      <div>
        <Row style={{ margin: "13% 0% 5% 0%" }}>
          <Col md={1} lg={2}></Col>
          <Col xs={12} md={10} lg={8}>
            <Card>
              <Card.Body>
                <div>
                  <h2 className="myHeading">Details</h2>
                </div>
                <Row>
                  <Col md={3} lg={4}></Col>
                  <Col xs={12} md={6} lg={4}>
                    <div className="detailedViewImageDiv">
                      <img
                        src={profilePicture}
                        alt="profile picture of this person"
                        width="100%"
                        className="roundedImg myBorder"
                      />
                    </div>
                  </Col>
                </Row>
                <hr />
                <div
                  className="detailsDiv"
                  style={{ width: "94%", margin: "5% 3% 5% 3%" }}
                >
                  <div>
                    Username:
                    {this.state.details.username ? (
                      <div>{this.state.details.username}</div>
                    ) : (
                      <div>N/A</div>
                    )}
                  </div>
                  <br />

                  {this.state.details.first_name ? (
                    <>
                      <div>
                        <div>First name:</div>
                        {this.state.details.first_name}
                      </div>
                      <br />
                    </>
                  ) : null}

                  {this.state.details.middle_name ? (
                    <>
                      <div>
                        <div>Middle name:</div>
                        {this.state.details.middle_name}
                      </div>
                      <br />
                    </>
                  ) : null}

                  {this.state.details.last_name ? (
                    <>
                      <div>
                        <div>Last name:</div>
                        {this.state.details.last_name}
                      </div>
                      <br />
                    </>
                  ) : null}

                  <hr />

                  <Email email={this.state.details.email} />
                  <br />
                  <ContactNumber
                    contact_number={this.state.details.contact_number}
                  />
                  <br />

                  {this.state.details.social_media !== undefined ? (
                    <>
                      <SocialMedia
                        social_media={this.state.details.social_media}
                      />
                    </>
                  ) : (
                    <></>
                  )}
                  <hr />

                  <div>
                    {this.state.details.createdAt ? (
                      <>
                        <div>
                          Joined at{" "}
                          <time dateTime={this.state.details.createdAt}>
                            {this.state.details.joinedAt}
                          </time>
                        </div>
                        <div>
                          {this.state.details.lastUpdatedAt !==
                          this.state.details.joinedAt ? (
                            <>
                              <div>
                                Profile last updated at{" "}
                                <time dateTime={this.state.details.updatedAt}>
                                  {this.state.details.lastUpdatedAt}
                                </time>
                              </div>
                            </>
                          ) : null}
                        </div>
                        <br />
                        <br />
                      </>
                    ) : null}
                  </div>

                  <div>
                    <div>Profile link:</div>
                    <div>
                      <a href={window.location.href}>{window.location.href}</a>
                    </div>
                  </div>

                  {this.state.additionalDataLoading === true ? (
                    <div className="text-center">
                      <Loading />
                    </div>
                  ) : (
                    <>
                      {getCookie("loggedIn") === "true" &&
                      (this.state.already_contact === true ||
                        this.state.added) ? (
                        <>
                          <br />
                          <div className="text-center">
                            <button
                              className="btn btn-danger"
                              id="removeContactButton"
                              onClick={() =>
                                this.removeContact(this.props.match.params.id)
                              }
                              disabled={
                                this.state.removing === true ? true : false
                              }
                            >
                              {this.state.removing === true ? (
                                <>Removing...</>
                              ) : (
                                <>Remove contact</>
                              )}
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="text-center mt-3">
                            <button
                              className="btn btn-primary"
                              onClick={() =>
                                this.addToContact(this.props.match.params.id)
                              }
                              disabled={this.state.buttonDisabled}
                            >
                              <>
                                {this.state.buttonDisabled ? (
                                  <>Adding...</>
                                ) : (
                                  <>Add to contacts</>
                                )}
                              </>
                            </button>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

DetailedView.defaultProps = {};
