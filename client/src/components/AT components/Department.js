import React, { Component } from "react";

//Config
import { config } from "../../config.js";
const configData = config();
const domain_url = configData.EXPRESS_JS_SERVER_URL;

export default class Department extends Component {
  state = {
    valid_college_name: false,
  };

  async componentDidUpdate(prevProps, prevState) {
    if (prevProps.college_name !== this.props.college_name) {
      //Batch details
      const starting_year = document.getElementById("starting_year").value;
      if (starting_year.length > 3) {
        const ending_year = document.getElementById("ending_year").value;
        if (ending_year.length > 3) {
          const batch = starting_year + "-" + ending_year;

          //Dynamic api url
          const base_url = domain_url + "/api/department/college_name/";
          const college_name = this.props.college_name;
          const url = base_url + college_name + "/batch/" + batch;

          //basic api authentication
          const username = process.env.REACT_APP_BASIC_AUTH_USERNAME;
          const password = process.env.REACT_APP_BASIC_AUTH_PASSWORD;

          //Fetch data
          const response = await fetch(url, {
            method: "get",
            headers: new Headers({
              Authorization: "Basic " + btoa(username + ":" + password),
              "Content-Type": "application/x-www-form-urlencoded",
            }),
          });
          const data = await response.json();

          if (data.status === 200) {
            this.setState({
              departments: data.data,
              valid_college_name: true,
            });
          }
        }
      }
    }
  }

  render(props) {
    if (!this.state.valid_college_name) {
      return (
        <>
          <label htmlFor="department_name">Department</label>
          <input
            className="form-control"
            type="text"
            name="department_name"
            id="department_name"
          />
        </>
      );
    }
    return (
      <div>
        <label htmlFor="department_name">Department</label>
        <input
          className="form-control"
          type="text"
          name="department_name"
          id="department_name"
          list="departments_list"
        />
        <datalist id="departments_list">
          {this.state.departments.map((department) => (
            <option
              value={department.department_name.abbreviation}
              key={department._id}
            ></option>
          ))}
        </datalist>
      </div>
    );
  }
}
