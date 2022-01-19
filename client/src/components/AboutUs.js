import React, { Component } from "react";
import axios from "axios";

//Config
import { config } from "../config.js";
import Loading from "./Loading.js";
import AboutPerson from "./AboutPerson.js";
const configData = config();
const domain_url = configData.EXPRESS_JS_SERVER_URL;

export default class AboutUs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: false,
      loading: true,
    };
  }

  async fetchData() {
    this.setState({ loading: true });

    //basic api authentication
    const username = process.env.REACT_APP_BASIC_AUTH_USERNAME;
    const password = process.env.REACT_APP_BASIC_AUTH_PASSWORD;

    //STARTS HERE

    const headers = {
      "Content-Type": "application/json",
      auth: {
        username: username,
        password: password,
      },
      credentials: "include",
      withCredentials: true,
    };

    const url = domain_url + "/api/about_us_singleton";
    await axios
      .get(url, headers)
      .then((res) => {
        if (res.status === 200 && res.data.status === 200) {
          this.setState({
            data: res.data.data,
            success: true,
          });
        }

        this.setState({
          loading: false,
        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          loading: false,
          error: true,
        });
      });
  }
  async componentDidMount() {
    await this.fetchData();
  }
  render() {
    return (
      <div style={{ marginTop: "5%" }}>
        <h2 className="myHeading">About Us</h2>
        <div>
          {this.state.error ? (
            <div className="text-center mt-5 mb-5">
              Unable to fetch about us
            </div>
          ) : (
            <div>
              {this.state.loading ? (
                <div className="text-center mt-5 mb-5">
                  <Loading />
                </div>
              ) : (
                <div>
                  {this.state.data &&
                    this.state.data.map((person) => (
                      <AboutPerson key={person._id} person={person} />
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}
