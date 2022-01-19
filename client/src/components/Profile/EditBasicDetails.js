import React, { Component } from "react";
import axios from "axios";
/*
import PropTypes from 'prop-types';
import editBasicDetails from '../../actions/editBasicDetailsAction'



import { connect } from 'react-redux';
*/

//CSS
import { Row, Col } from "react-bootstrap";

//import functions
import { increaseGoogleProfilePictureSize } from "../../functions/increaseGoogleProfilePictureSize";

import Loading from "../Loading";

//Config
import { config } from "../../config.js";
const configData = config();
const domain_url = configData.EXPRESS_JS_SERVER_URL;
//require('react-redux');

class EditBasicDetails extends Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      username: "",
      first_name: "",
      last_name: "",
      middle_name: "",
      loading: true,
    };
  }

  componentDidMount() {
    const url = domain_url + "/api/member/basic_details";

    //basic api authentication
    const username = process.env.REACT_APP_BASIC_AUTH_USERNAME;
    const password = process.env.REACT_APP_BASIC_AUTH_PASSWORD;

    const headers = {
      "Content-Type": "application/json",
      auth: {
        username: username,
        password: password,
      },
      withCredentials: true,
    };

    axios
      .get(url, headers)
      .then((response) => {
        //Check for axios response status
        if (response.status === 200) {
          //check for server response status
          const status = response.data.status;
          if (status === 200) {
            var {
              username,
              first_name,
              middle_name,
              last_name,
              profilePictureUrl,
              signInType,
            } = response.data.data;

            if (!profilePictureUrl) {
              profilePictureUrl = "assets/images/user5.webp";
            }

            //Increase image size to increase clarity
            else if (signInType === "google") {
              profilePictureUrl =
                increaseGoogleProfilePictureSize(profilePictureUrl);
            }
            this.setState({
              username,
              first_name,
              middle_name,
              last_name,
              profilePictureUrl,
            });
          }
        }

        this.setState({
          loading: false,
        });
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
      });
  }

  //Destroy the message onunmounting
  componentWillUnmount() {}

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  updateBasicDetails(form_data, info_div, submit_button) {
    const url = domain_url + "/api/member/basic_details";

    //basic api authentication
    const username = process.env.REACT_APP_BASIC_AUTH_USERNAME;
    const password = process.env.REACT_APP_BASIC_AUTH_PASSWORD;

    const headers = {
      "Content-Type": "application/json",
      auth: {
        username: username,
        password: password,
      },
      withCredentials: true,
    };

    axios
      .patch(url, form_data, headers)
      .then((response) => {
        //Check for axios response status
        if (response.status === 200) {
          //check for server response status
          const status = response.data.status;
          if (status === 200) {
          } else {
          }
          info_div.innerHTML = response.data.message;
          submit_button.disabled = false;
        } else {
          info_div.innerHTML = "Unable to update details";
          submit_button.disabled = false;
        }
      })
      .catch((error) => {
        info_div.innerHTML = "Unable to update details";
        submit_button.disabled = false;
      });
  }
  onSubmit(e) {
    e.preventDefault();

    //Disable submit button in the mean time
    var submit_button = document.getElementById("update");
    submit_button.disabled = true;

    //Info div
    var info_div = document.getElementById("info");
    info_div.innerHTML = "Logging in..Please wait...";

    //Post data
    var form_data = {
      username: this.state.username,
      first_name: this.state.first_name,
      middle_name: this.state.middle_name,
      last_name: this.state.last_name,
      profilePicture: this.state.profilePicture,
    };

    this.updateBasicDetails(form_data, info_div, submit_button);

    submit_button.disabled = false;
  }

  pfpChange(e) {
    var picture = e.target.files[0];

    var src = URL.createObjectURL(picture);

    this.setState({
      profilePictureUrl: src,
      profilePicture: picture,
    });
  }

  render() {
    return (
      <div>
        <Row>
          <Col md={2} lg={4}></Col>
          <Col
            xs={12}
            md={8}
            lg={4}
            id="editBasicDetailsForm"
            className="myBorder"
          >
            <h2 className="myHeading">Edit basic details</h2>

            {this.state.loading ? (
              <>
                <div className="text-center">
                  <Loading />
                </div>
              </>
            ) : (
              <>
                <form onSubmit={this.onSubmit} encType="multipart/form-data">
                  <div className="form-group text-center">
                    <label htmlFor="img">
                      <img
                        src={this.state.profilePictureUrl}
                        width="100"
                        height="100"
                        alt="profile"
                      />
                    </label>
                    <input
                      className="form-control"
                      type="file"
                      id="img"
                      name="img"
                      accept="image/*"
                      hidden
                      onChange={(e) => this.pfpChange(e)}
                    ></input>
                  </div>
                  <div className="form-group">
                    <label htmlFor="username">Username: </label>
                    <input
                      className="form-control"
                      type="text"
                      id="username"
                      name="username"
                      value={this.state.username}
                      onChange={(e) => this.onChange(e)}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="firstName">First name: </label>
                    <input
                      className="form-control"
                      type="text"
                      id="firstName"
                      name="first_name"
                      value={this.state.first_name}
                      onChange={(e) => this.onChange(e)}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="middleName">Middle name: </label>
                    <input
                      className="form-control"
                      type="text"
                      id="middleName"
                      name="middle_name"
                      value={this.state.middle_name}
                      onChange={(e) => this.onChange(e)}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="lastName">Last name: </label>
                    <input
                      className="form-control"
                      type="text"
                      id="lastName"
                      name="last_name"
                      value={this.state.last_name}
                      onChange={(e) => this.onChange(e)}
                    />
                  </div>

                  <div className="form-group">
                    <input
                      className="form-control btn btn-primary"
                      type="submit"
                      id="update"
                    />
                  </div>
                </form>
              </>
            )}

            <div id="info"></div>
          </Col>
        </Row>
      </div>
    );
  }
}

/*
EditBasicDetails.protoTypes = {
    editBasicDetails: PropTypes.func.isRequired,
    getBasicDetails : PropTypes.func.isRequired,
    
};

const mapStateToProps = state => ({
    
    message: state.basicDetails.message,
    status:  state.basicDetails.status,
    //getDetailsStatus: state.fetchedBasicDetails.status,
    //data: state.fetchedBasicDetails.data,
});
*/

//export default connect(mapStateToProps,{ editBasicDetails  })(EditBasicDetails);
export default EditBasicDetails;
