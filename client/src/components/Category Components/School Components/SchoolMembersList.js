import React, { Component } from "react";
import Loading from "../../Loading";
import { BrowserRouter as Route, Link } from "react-router-dom";

//Config
import { config } from "../../../config.js";
const configData = config();
const domain_url = configData.EXPRESS_JS_SERVER_URL;

export default class SchoolMembersList extends Component {
  state = {
    loading: true,
    data: null,
  };

  async componentDidMount() {
    const base_url = domain_url + "/api/member/students/school_id/";

    const url = base_url + this.props.match.params.school_id;

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

    if (data.status === 200) {
      this.setState({ data: data.data, loading: false });
    } else {
      this.setState({ error: true, loading: false });
    }
  }

  render() {
    return (
      <div>
        <h2>School</h2>
        <h3>School name goes here</h3>

        {this.state.loading ? (
          <Loading />
        ) : (
          <>
            {!this.state.error ? (
              <>
                {this.state.data.length === 1 ? (
                  <>
                    <Link to={`/details/${this.state.data[0]._id}`}>
                      {this.state.data[0].name}
                    </Link>
                  </>
                ) : (
                  <>
                    <ul>
                      {this.state.data.map((datum) => (
                        <li key={datum._id}>
                          <Link to={`/details/${datum._id}`}>{datum.name}</Link>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </>
            ) : (
              <>Could not fetch school members</>
            )}
          </>
        )}
      </div>
    );
  }
}
