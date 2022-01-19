import React, { Component } from "react";
import { BrowserRouter as Route, Link } from "react-router-dom";

//Config
import { config } from "../../../config.js";
import Loading from "../../Loading.js";
const configData = config();
const domain_url = configData.EXPRESS_JS_SERVER_URL;

export default class DepartmentList extends Component {
  state = {
    loading: true,
    departments: null,
  };

  async componentDidMount() {
    const base_url = domain_url + "/api/department/college/";
    const college_id = this.props.match.params.college_id;
    const batch_id = this.props.match.params.batch_id;

    const url = base_url + college_id + "/batch/" + batch_id;

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

    this.setState({ departments: data, loading: false });
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

    if (!this.state.departments) {
      return <div className="text-center">No department found</div>;
    }

    if (this.state.departments.length === 0) {
      return <div className="text-center">No department is available</div>;
    }
    if (this.state.departments.length === 1) {
      return (
        <div className="text-center">
          <Link
            to={`/department/${this.state.departments[0]._id}`}
            className="btn btn-primary btnLink mb-3"
          >
            {this.state.departments[0].department_name.abbreviation}
          </Link>
        </div>
      );
    }
    return (
      <div>
        <h2 className="myHeading">Departments</h2>
        <ul>
          {this.state.departments.map((department) => (
            <li key={department._id} className="text-center">
              <Link
                to={`/department/${department._id}`}
                className="btn btn-primary btnLink mb-3"
              >
                {department.department_name.abbreviation}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
