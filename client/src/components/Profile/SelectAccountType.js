import React, { Component } from "react";
import axios from "axios";
import Loading from "../Loading";
import { BrowserRouter as Switch, Link } from "react-router-dom";
import { Redirect } from "react-router-dom";
import Button from "../Button";

import AccountType from "../AT components/AccountType";

//import functions
import { getCookie } from "../../functions/getCookie";

//Config
import { config } from "../../config.js";
import { Col, Row } from "react-bootstrap";
const configData = config();
const domain_url = configData.EXPRESS_JS_SERVER_URL;

const SITE_KEY = process.env.REACT_APP_SITE_KEY;

export default class SelectAccountType extends Component {
  constructor(props) {
    super(props);

    this.submitHandler = this.submitHandler.bind(this);
    this.submitData = this.submitData.bind(this);

    this.state = {
      username: "",
      email: "",
      formValues: [{ email: "" }],
      //contactNumbers: [{ number : "" , country_code : "" }]
    };
  }

  //Used to fetch ids for different categories which is sent as user input to server
  async componentDidMount() {
    if (getCookie("loggedIn") !== "true") {
      const redirectUrl = "/login?redirectUrl=/account/select_account_type/";
      this.setState({
        redirectUrl: redirectUrl,
        loggedIn: false,
      });

      return false;
    }

    const url = domain_url + "/api/organisation_category";

    //basic api authentication
    const username = process.env.REACT_APP_BASIC_AUTH_USERNAME;
    const password = process.env.REACT_APP_BASIC_AUTH_PASSWORD;

    const response = await fetch(url, {
      method: "get",
      headers: new Headers({
        Authorization: "Basic " + btoa(username + ":" + password),
        "Content-Type": "application/json",
        Accept: "application/json",
      }),
    });

    const data = await response.json();

    for (var i = 0; i < data.length; i++) {
      if (data[i].name === "college") {
        const college_id_type = data[i]._id;
        this.setState({
          college_id_type: college_id_type,
        });
      } else if (data[i].name === "school") {
        const school_type_id = data[i]._id;
        this.setState({
          school_type_id: school_type_id,
        });
      } else if (data[i].name === "company") {
        const private_organisation_type_id = data[i]._id;
        this.setState({
          private_organisation_type_id: private_organisation_type_id,
        });
      } else if (data[i].name === "general") {
        const general_account_id = data[i]._id;
        this.setState({
          general_account_id: general_account_id,
        });
      }
    }

    this.setState({
      loading: false,

      ids: {
        general_account_id: this.state.general_account_id,
        private_organisation_type_id: this.state.private_organisation_type_id,
        school_type_id: this.state.school_type_id,
        college_id_type: this.state.college_id_type,
      },
      ids_list: [
        {
          _id: this.state.college_id_type,
          name: "college",
        },
        {
          _id: this.state.school_type_id,
          name: "school",
        },
        {
          _id: this.state.general_account_id,
          name: "general",
        },
        {
          _id: this.state.private_organisation_type_id,
          name: "company",
        },
      ],
    });
  }

  submitData = (submit_button, info_div, form_data) => {
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
          form_data.reCAPTCHAToken = tokenRecieved;

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

          const url = domain_url + "/api/member";
          axios
            .patch(url, form_data, headers)
            .then((response) => {
              info_div.innerHTML = response.data.message;
              submit_button.disabled = false;

              if (response.data.status === 200) {
                info_div.innerHTML = "Account type selected successfully";
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
  };

  async submitHandler(e) {
    e.preventDefault();

    //Disable submit button in the mean time
    var submit_button = document.getElementById("submit");
    submit_button.disabled = true;

    //Info div
    var info_div = document.getElementById("info");
    info_div.innerHTML = "Submiting..Please wait...";

    var account_type = document.getElementById("account_type").value;

    //College account details
    if (account_type === this.state.college_id_type) {
      const college_name = document.getElementById("college_name").value;
      if (college_name.length < 1) {
        info_div.innerHTML = "Please enter your college name";
        submit_button.disabled = false;
      } else {
        const department = document.getElementById("department_name").value;
        if (department.length < 1) {
          info_div.innerHTML = "Please enter your department name";
          submit_button.disabled = false;
        } else {
          const section = document.getElementById("section").value;
          if (section.length < 1) {
            info_div.innerHTML = "Please enter your section";
            submit_button.disabled = false;
          } else {
            const starting_year =
              document.getElementById("starting_year").value;
            const ending_year = document.getElementById("ending_year").value;

            if (starting_year.length < 1 || ending_year.length < 1) {
              info_div.innerHTML = "Please enter your batch";
              submit_button.disabled = false;
            } else {
              const batch = {
                starting_year: starting_year,
                pass_out_year: ending_year,
              };

              const college_student_details = {
                section: section,
                department_name: department,
                college_name: college_name,
                batch: batch,
              };

              account_type = {
                type: this.state.college_id_type,
                college_student_details: college_student_details,
              };

              //Final form data
              var form_data = {
                account_type: account_type,
              };

              this.submitData(submit_button, info_div, form_data);
            }
          }
        }
      }
    }
    //Other account type submition
    else if (account_type === this.state.private_organisation_type_id) {
      var company_name = document.getElementById("company_name").value;
      account_type = {
        type: this.state.private_organisation_type_id,
        company_details: {
          company_name: company_name,
        },
      };

      //Final form data
      form_data = {
        account_type: account_type,
      };

      this.submitData(submit_button, info_div, form_data);
    }
    //School
    else if (account_type === this.state.school_type_id) {
      var school_name = document.getElementById("school_name").value;
      account_type = {
        type: this.state.school_type_id,
        school_student_details: {
          school_name: school_name,
        },
      };

      //Final form data
      form_data = {
        account_type: account_type,
      };

      alert(JSON.stringify(form_data));

      this.submitData(submit_button, info_div, form_data);
    } else {
      if (account_type === "none") {
        account_type = {
          type: this.state.general_account_id,
        };
      } else {
        account_type = {
          type: account_type,
        };
      }

      //Final form data
      form_data = {
        account_type: account_type,
      };

      this.submitData(submit_button, info_div, form_data);
    }
  }

  render() {
    if (this.state.redirectUrl !== undefined) {
      const path = this.state.redirectUrl;
      return <Redirect to={path} />;
    }

    return (
      <div>
        <Row>
          <Col xs={12} md={2} lg={3}></Col>
          <Col
            xs={12}
            md={8}
            lg={6}
            id="selectAccountTypeForm"
            className="myBorder"
          >
            <div>
              <h2 className="myHeading">Select account type</h2>
            </div>
            <div className="mt-3">
              <form onSubmit={this.submitHandler}>
                {this.state.loading ? (
                  <>
                    <Loading />
                  </>
                ) : (
                  <AccountType
                    ids_list={this.state.ids_list}
                    ids={this.state.ids}
                  />
                )}

                <br />

                <div>
                  <Button
                    className="btn-primary"
                    text="submit"
                    id="submit"
                    name="submit"
                  />
                </div>

                <div id="info"></div>
              </form>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
