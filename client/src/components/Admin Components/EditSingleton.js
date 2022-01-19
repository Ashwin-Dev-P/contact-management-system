import React, { Component } from "react";

//CSS
import { Row, Col } from "react-bootstrap";
import Button from "../Button";
import Loading from "../Loading";
import DynamicEmail from "../Register Components/DynamicEmail";
import DynamicWhatsApp from "../Register Components/DynamicWhatsApp";
import AdditionalUrl from "../Register Components/AdditionalUrl";

//Config
import { config } from "../../config.js";
import axios from "axios";

const configData = config();
const domain_url = configData.EXPRESS_JS_SERVER_URL;

const SITE_KEY = process.env.REACT_APP_SITE_KEY;

export default class EditSingleton extends Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
    this.setEmail = this.setEmail.bind(this);
    this.setWhatsApp = this.setWhatsApp.bind(this);
    this.setAdditionalUrl = this.setAdditionalUrl.bind(this);

    this.state = {
      loading: true,
      follow_us: [],
    };
  }

  async setEmail(email) {
    this.setState({
      email,
    });
  }

  async setWhatsApp(whatsApp) {
    this.setState({
      whatsApp,
    });
  }

  async setAdditionalUrl(url) {
    //Converting the url objects to different format so it can be stored in Database

    var follow_us_array = [];
    for (var i = 0; i < url.length; i++) {
      var myLinkObj = {
        link_name: url[i].urlTitle,
        link_url: url[i].url,
      };
      follow_us_array.push(myLinkObj);
    }
    this.setState({
      follow_us: follow_us_array,
    });
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

    const url = domain_url + "/api/singleton/all";

    axios
      .get(url, headers)
      .then((response) => {
        if (
          response.status === 200 &&
          response.headers["content-type"] === "application/json; charset=utf-8"
        ) {
          var { about_us, title, contact_us, follow_us } = response.data;

          //Converting the follow us objects to different format so it can be used in dynamicLink component
          var follow_us_array = [];
          for (var i = 0; i < follow_us.length; i++) {
            var myLinkObj = {
              urlTitle: follow_us[i].link_name,
              url: follow_us[i].link_url,
            };
            follow_us_array.push(myLinkObj);
          }

          this.setState({
            data: response.data,
            about_us: about_us,
            expansion: title.expansion,
            abbreviation: title.abbreviation,
            email: contact_us.email || [" "],
            whatsApp: contact_us.whatsapp,
            url: follow_us_array,

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

  submitHandler(e) {
    e.preventDefault();

    this.setState({
      submitting: true,
    });

    //Info div
    var info_div = document.getElementById("info");

    var form_data = {
      title: {
        abbreviation: this.state.abbreviation,
        expansion: this.state.expansion,
      },
      about_us: this.state.about_us,
      contact_us: {
        email: this.state.email,
        whatsapp: this.state.whatsApp,
      },
      follow_us: this.state.follow_us,
    };

    window.grecaptcha.ready(() => {
      window.grecaptcha
        .execute(SITE_KEY, { action: "submit" })
        .then((token) => {
          if (!token) {
            info_div.innerHTML = "reCAPTCHA error";
            this.setState({
              submitting: false,
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

          var url = domain_url + "/api/singleton";

          axios
            .post(url, form_data, headers)
            .then((response) => {
              info_div.innerHTML = response.data.message;

              this.setState({
                submitting: false,
              });
            })
            .catch((error) => {
              info_div.innerHTML = "Error occured while updating";
            });

          this.setState({
            submitting: false,
          });
        });
    });
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  render() {
    return (
      <div>
        <Row>
          <Col xs={12} md={2} lg={3}></Col>
          <Col xs={12} md={8} lg={6} className="myDiv myBorder">
            <h2 className="myHeading">Edit Details</h2>

            {this.state.loading === true ? (
              <div className="text-center">
                {" "}
                <Loading />{" "}
              </div>
            ) : (
              <>
                <form method="post" onSubmit={this.submitHandler}>
                  <div className="form-group">
                    <label htmlFor="expansion">title expansion</label>
                    <input
                      className="form-control"
                      type="text"
                      id="expansion"
                      name="expansion"
                      value={this.state.expansion}
                      onChange={this.onChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="abbreviation">title abbreviation</label>
                    <input
                      className="form-control"
                      type="text"
                      id="abbreviation"
                      name="abbreviation"
                      value={this.state.abbreviation}
                      onChange={this.onChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="about_us">About Us</label>
                    <textarea
                      className="form-control"
                      id="about_us"
                      name="about_us"
                      value={this.state.about_us}
                      onChange={this.onChange}
                    >
                      {this.state.about_us}
                    </textarea>
                  </div>

                  <div className="form-group">
                    <DynamicEmail
                      emails={this.state.email}
                      setEmail={this.setEmail}
                    />
                  </div>
                  <div className="form-group">
                    <DynamicWhatsApp
                      numbers={this.state.whatsApp}
                      setWhatsApp={this.setWhatsApp}
                    />
                  </div>

                  <div className="form-group">
                    <AdditionalUrl
                      url={this.state.url}
                      setAdditionalUrl={this.setAdditionalUrl}
                    />
                  </div>

                  {this.state.submitting === true ? (
                    <Button
                      className="btn-primary"
                      type="submit"
                      text="Updating..."
                      disabled={true}
                      loading={true}
                    />
                  ) : (
                    <Button
                      className="btn-primary"
                      type="submit"
                      text="Update"
                    />
                  )}

                  <div id="info"></div>
                </form>
              </>
            )}
          </Col>
        </Row>
      </div>
    );
  }
}
