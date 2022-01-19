import React, { Component } from "react";
import { BrowserRouter as Route, Link } from "react-router-dom";

//Config
import { config } from "../../../config.js";
import Loading from "../../Loading.js";
const configData = config();
const domain_url = configData.EXPRESS_JS_SERVER_URL;

export default class CompanyList extends Component {
  state = {
    loading: true,
    data: null,
  };

  async componentDidMount() {
    const url = domain_url + "/api/company";

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

    this.setState({ companies: data, loading: false });
  }

  render() {
    if (this.state.loading) {
      return (
        <div className="text-center">
          {" "}
          <Loading />{" "}
        </div>
      );
    }

    if (!this.state.companies || this.state.companies.length === 0) {
      return <div className="text-center">No companies found</div>;
    }

    return (
      <div>
        <div>
          <h2 className="myHeading">Companies</h2>
          <ul>
            {this.state.companies.map((company) => (
              <li key={company._id} className="text-center">
                <Link
                  to={`/company/${company._id}`}
                  className="btn btn-primary btnLink mb-3"
                >
                  {company.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}
