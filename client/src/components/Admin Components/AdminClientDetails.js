import React, { Component } from "react";
import axios from "axios";

//Config
import { config } from "../../config.js";
import Loading from "../Loading.js";
const configData = config();
const domain_url = configData.EXPRESS_JS_SERVER_URL;

export default class AdminClientDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.loadClientDetails = this.loadClientDetails.bind(this);
  }

  async componentDidMount() {
    await this.loadClientDetails();
  }

  async loadClientDetails() {
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

    const url = domain_url + "/api/clientDetails";
    axios
      .get(url, headers)
      .then((res) => {
        if (res.status === 200) {
          this.setState({
            data: res.data,
            success: true,
            loading: false,
          });
        }
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          loading: false,
        });
      });
  }
  render() {
    return (
      <div>
        <h2 className="myHeading">Client Details</h2>
        <div>
          {this.state.loading ? (
            <>
              <div className="text-center">
                <Loading />
              </div>
            </>
          ) : (
            <>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Visited At</th>
                    <th>IP</th>
                    <th>OS name</th>
                    <th>OS version</th>
                    <th>Browser name</th>
                    <th>Browser version</th>
                    <th>Navigator user agent</th>
                    <th>Navigator vendor</th>
                  </tr>
                </thead>
                <tbody>
                  {!this.state.loading ? (
                    <>
                      {this.state.success ? (
                        <>
                          {this.state.data.map((datum, index) => (
                            <tr key={datum._id}>
                              <td>{index + 1}</td>
                              <td>
                                {new Intl.DateTimeFormat("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "2-digit",
                                }).format(
                                  new Date(Date.parse(datum.createdAt))
                                )}
                              </td>
                              <td> {datum.ipAddress} </td>
                              <td>{datum.osName}</td>
                              <td>{datum.osVersion}</td>
                              <td>{datum.browserName}</td>
                              <td>{datum.browserVersion}</td>
                              <td>{datum.navigatorUserAgent}</td>
                              <td>{datum.navigatorVendor}</td>
                            </tr>
                          ))}
                        </>
                      ) : (
                        <></>
                      )}
                    </>
                  ) : (
                    <></>
                  )}
                </tbody>
                <tfoot></tfoot>
              </table>
            </>
          )}
        </div>
      </div>
    );
  }
}
