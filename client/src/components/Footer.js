import React, { Component } from "react";

//Config
import { config } from "../config.js";
import axios from "axios";

import Loading from "./Loading";
import { Col, Row } from "react-bootstrap";

const configData = config();
const domain_url = configData.EXPRESS_JS_SERVER_URL;

export default class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data_error: false,
      about_us: "",
      follow_us: configData.follow_us,
      contact_us: configData.contact_us,
    };
  }

  async componentDidMount() {
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

    const url = domain_url + "/api/singleton/footer";

    axios
      .get(url, headers)
      .then((response) => {
        if (
          response.status === 200 &&
          response.headers["content-type"] === "application/json; charset=utf-8"
        ) {
          this.setState({
            data: response.data,
            error: false,
            loading: false,
          });
        } else {
          this.setState({
            error: true,
            loading: false,
          });
        }
      })
      .catch((error) => {
        this.setState({
          error: true,
          loading: false,
        });
      });
  }

  render() {
    return (
      <footer id="footer" className="myBorder">
        <div className="container">
          <Row>
            {this.state.data === null ? (
              <div className="text-center">Footer data not available</div>
            ) : (
              <>
                <Col xs={12} lg={4}>
                  <h3>About Us</h3>
                  <div>
                    {this.state.loading ? (
                      <Loading />
                    ) : (
                      <>
                        {this.state.data !== undefined &&
                        this.state.data.about_us !== undefined &&
                        !this.state.error ? (
                          <>
                            <p>{this.state.data.about_us}</p>
                          </>
                        ) : (
                          <>
                            <p>{this.state.about_us}</p>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </Col>
                <Col xs={12} lg={4}>
                  <h3>Follow Us</h3>

                  <div>
                    {this.state.loading ? (
                      <Loading />
                    ) : (
                      <>
                        {this.state.data !== undefined &&
                        this.state.data.follow_us !== undefined &&
                        !this.state.error ? (
                          <>
                            <ul>
                              {this.state.data.follow_us.map((data) => (
                                <li key={data._id}>
                                  <a
                                    href={data.link_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {data.link_name}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </>
                        ) : (
                          <>
                            <ul>
                              {this.state.follow_us.map((data) => (
                                <li key={data._id}>
                                  <a
                                    href={data.link_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {data.link_name}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </Col>
                <Col xs={12} lg={4}>
                  <h3>Contact Us</h3>

                  <div>
                    {this.state.loading ? (
                      <Loading />
                    ) : (
                      <>
                        {/*  Contact us  */}
                        <address>
                          {this.state.data !== undefined &&
                          this.state.data.contact_us !== undefined &&
                          !this.state.error ? (
                            <>
                              {this.state.data.contact_us.email !== undefined &&
                              this.state.data.contact_us.email.length > 0 ? (
                                <>
                                  Email:
                                  <ul>
                                    {this.state.data.contact_us.email.map(
                                      (email) => (
                                        <li key={email}>
                                          <a
                                            href={`mailto:${email}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            {email}
                                          </a>
                                        </li>
                                      )
                                    )}
                                  </ul>
                                </>
                              ) : (
                                <>
                                  <ul>
                                    {this.state.contact_us.email.map(
                                      (email) => (
                                        <li key={email}>
                                          <a
                                            href={`mailto:${email}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            {email}
                                          </a>
                                        </li>
                                      )
                                    )}
                                  </ul>
                                </>
                              )}

                              {this.state.data.contact_us.whatsapp !==
                              undefined ? (
                                <>
                                  Whatsapp
                                  <ul>
                                    {this.state.data.contact_us.whatsapp.map(
                                      (whatsapp) => (
                                        <li key={whatsapp._id}>
                                          <a
                                            href={`https://api.whatsapp.com/send?phone=+${whatsapp.country_code} ${whatsapp.number}&text=Hi. I am here from your Contact management system web application.`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            {" "}
                                            +{whatsapp.country_code}{" "}
                                            {whatsapp.number}
                                          </a>
                                        </li>
                                      )
                                    )}
                                  </ul>
                                </>
                              ) : (
                                <>
                                  Whatsapp
                                  <ul>
                                    {this.state.contact_us.whatsapp.map(
                                      (whatsapp) => (
                                        <li key={whatsapp._id}>
                                          <a
                                            href={`https://api.whatsapp.com/send?phone=+${whatsapp.country_code} ${whatsapp.number}&text=Hi. I am here from your Contact management system web application.`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            {" "}
                                            +{whatsapp.country_code}{" "}
                                            {whatsapp.number}
                                          </a>
                                        </li>
                                      )
                                    )}
                                  </ul>
                                </>
                              )}
                            </>
                          ) : (
                            <>
                              Email
                              <ul>
                                {this.state.contact_us.email.map((email) => (
                                  <li key={email}>
                                    <a
                                      href={`mailto:${email}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      {email}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                              Whatsapp
                              <ul>
                                {this.state.contact_us.whatsapp.map(
                                  (whatsapp) => (
                                    <li key={whatsapp._id}>
                                      <a
                                        href={`https://api.whatsapp.com/send?phone=+${whatsapp.country_code} ${whatsapp.number}&text=Hi. I am here from your Contact management system web application.`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        {" "}
                                        +{whatsapp.country_code}{" "}
                                        {whatsapp.number}
                                      </a>
                                    </li>
                                  )
                                )}
                              </ul>
                            </>
                          )}
                        </address>
                      </>
                    )}
                  </div>
                </Col>
              </>
            )}
          </Row>
        </div>
      </footer>
    );
  }
}

/* To Do: Add direct phone number in contact us div */
