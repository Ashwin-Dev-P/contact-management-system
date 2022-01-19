import React, { Component } from "react";
import Person from "./Person";

//Config
import { config } from "../config.js";
import { Row } from "react-bootstrap";
import Loading from "./Loading";
const configData = config();
const domain_url = configData.EXPRESS_JS_SERVER_URL;

export default class CategorySortedList extends Component {
  state = {
    loading: true,
    details: null,
  };

  async componentDidMount() {
    const base_url = domain_url + "/api/member/category/";
    var url = "";
    if (this.props.match.params.type !== undefined) {
      url = base_url + this.props.match.params.type;
    } else {
      url = base_url + "general";
    }

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

    this.setState({ persons: data, loading: false });
  }

  render(props) {
    if (this.state.loading) {
      return (
        <div className="text-center">
          <Loading />
        </div>
      );
    }

    if (!this.state.persons) {
      return <div>No data found</div>;
    }

    if (this.state.persons.length === 0) {
      return (
        <div>
          No person under the category of {this.props.match.params.type} is
          available
        </div>
      );
    }

    return (
      <div>
        <div>
          <h2>{this.props.match.params.type}</h2>
        </div>
        <div>
          <ul>
            <Row>
              {this.state.persons.map((person) => (
                <li key={person._id} className="col-xs-12 col-md-6 col-lg-3">
                  <Person
                    username={person.username}
                    email={person.email}
                    contact_number={person.contact_number}
                    _id={person._id}
                  />
                </li>
              ))}
            </Row>
          </ul>
        </div>
      </div>
    );
  }
}
