import React, { Component } from "react";
import Loading from "../../Loading";
import { BrowserRouter as Route, Link } from "react-router-dom";

//Config
import { config } from "../../../config.js";
const configData = config();
const domain_url = configData.EXPRESS_JS_SERVER_URL;

export default class CompanyMembersList extends Component {
  state = {
    loading: true,
    data: null,
  };

  async componentDidMount() {
    const base_url = domain_url + "/api/member/company_members/company_id/";

    const url = base_url + this.props.match.params.company_id;

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
      this.setState({ data_found: false, loading: false });
    }
  }

  render() {
    return (
      <div>
        {this.state.data_found === false ? (
          <div className="text-center">Counldnt find data</div>
        ) : (
          <>
            {this.state.loading ? (
              <div className="text-center">
                <Loading />
              </div>
            ) : (
              <>
                <h2 className="myHeading">Members</h2>
                <ul>
                  {this.state.data.map((datum) => (
                    <li key={datum._id} className="text-center">
                      <Link
                        to={`/details/${datum._id}`}
                        className="btn btn-primary btnLink mb-3"
                      >
                        {datum.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </>
        )}
      </div>
    );
  }
}
