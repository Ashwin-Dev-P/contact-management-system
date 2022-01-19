import React, { Component } from "react";
import { Redirect } from "react-router";
import { getCookie } from "../../functions/getCookie";
import { BrowserRouter as Switch, Link } from "react-router-dom";
import Loading from "../Loading";

//Config
import { config } from "../../config.js";
const configData = config();
const domain_url = configData.EXPRESS_JS_SERVER_URL;

export default class Singleton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  async componentDidMount() {
    const base_url = domain_url + "/api/singleton/all";
    const url = base_url;

    //basic api authentication
    const username = process.env.REACT_APP_BASIC_AUTH_USERNAME;
    const password = process.env.REACT_APP_BASIC_AUTH_PASSWORD;

    const response = await fetch(url, {
      method: "get",
      headers: new Headers({
        Authorization: "Basic " + btoa(username + ":" + password),
        "Content-Type": "application/x-www-form-urlencoded",
      }),
    });
    const data = await response.json();

    this.setState({ details: data, loading: false });
  }

  render() {
    if (!getCookie("admin") || getCookie("admin") !== "true") {
      return <Redirect to="/admin/login?redirectUrl=/admin/singleton" />;
    }

    return (
      <div className="myDiv myBorder">
        <h3 className="myHeading">Singleton data</h3>

        {this.state.loading === true ? (
          <>
            <Loading />
          </>
        ) : (
          <>
            {this.state.details === null ? (
              <div className="text-center">
                No data available in the database
                <div>
                  <Link className="btn btn-primary mt-3" to="singleton/edit">
                    Add details
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div>
                  {this.state.details.title ? (
                    <>
                      <div>
                        Title
                        <div>
                          Abbreviation:
                          {this.state.details.title.abbreviation ? (
                            this.state.details.title.abbreviation
                          ) : (
                            <>N/A</>
                          )}
                          <br />
                          Expansion:
                          {this.state.details.title.expansion ? (
                            this.state.details.title.expansion
                          ) : (
                            <>N/A</>
                          )}{" "}
                          <br />
                        </div>
                      </div>
                    </>
                  ) : null}

                  <br />
                  <div>
                    About us
                    <br />
                    {this.state.details.about_us ? (
                      this.state.details.about_us
                    ) : (
                      <>N/A</>
                    )}
                  </div>
                  <br />

                  {this.state.details.follow_us &&
                  this.state.details.follow_us.length > 0 ? (
                    <>
                      <div>
                        Follow us
                        <br />
                        <ul>
                          {this.state.details.follow_us &&
                            this.state.details.follow_us.map((data) => (
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
                      </div>
                      <br />
                    </>
                  ) : null}

                  {this.state.details.contact_us ? (
                    <>
                      <div>
                        Contact us
                        <div>
                          Email:
                          <ul>
                            {this.state.details.contact_us &&
                              this.state.details.contact_us.email.map(
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
                        </div>
                        <div>
                          Whatsapp
                          <ul>
                            {this.state.details.contact_us.whatsapp &&
                              this.state.details.contact_us.whatsapp.map(
                                (whatsapp) => (
                                  <li key={whatsapp._id}>
                                    <a
                                      href={`https://api.whatsapp.com/send?phone=+${whatsapp.country_code} ${whatsapp.number}&text=Hi. I am here from your Contact management system web application.`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      {" "}
                                      +{whatsapp.country_code} {whatsapp.number}
                                    </a>
                                  </li>
                                )
                              )}
                          </ul>
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
                <Link className="btn btn-primary" to="singleton/edit">
                  Edit
                </Link>
              </>
            )}
          </>
        )}
      </div>
    );
  }
}
