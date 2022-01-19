import React from "react";
import Person from "./Person";
import Pagination from "./Pagination";
import Loading from "./Loading";

//Config
import { config } from "../config.js";
const configData = config();
const domain_url = configData.EXPRESS_JS_SERVER_URL;

export default class PersonList extends React.Component {
  constructor(props) {
    super(props);

    this.setCurrentPage = this.setCurrentPage.bind(this);

    this.state = {
      initialLoading: true,
      loading: true,
      persons: null,
      currentPage: 1,
      itemsPerPage: 10,
    };
  }

  async componentDidMount() {
    //basic api authentication
    const username = process.env.REACT_APP_BASIC_AUTH_USERNAME;
    const password = process.env.REACT_APP_BASIC_AUTH_PASSWORD;

    var headers = new Headers({
      Authorization: "Basic " + btoa(username + ":" + password),
      "Content-Type": "application/x-www-form-urlencoded",
    });

    //Calculate total pages
    var url = domain_url + "/api/member/count";
    var response = await fetch(url, {
      method: "get",
      headers: headers,
    });
    var data = await response.json();

    const totalItems = data.count;

    //Fetch necessary data
    url =
      domain_url +
      "/api/member/basic/from/" +
      (this.state.currentPage * this.state.itemsPerPage - 9) +
      "/count/" +
      this.state.itemsPerPage;
    response = await fetch(url, {
      method: "get",
      headers: headers,
    });
    data = await response.json();

    this.setState({
      persons: data,
      loading: false,
      initialLoading: false,
      totalItems: totalItems,
    });
  }

  async setCurrentPage(currentPage) {
    var currentPaginationPage = Number(currentPage);
    this.setState({
      currentPage: currentPaginationPage,
      loading: true,
    });

    //basic api authentication
    const username = process.env.REACT_APP_BASIC_AUTH_USERNAME;
    const password = process.env.REACT_APP_BASIC_AUTH_PASSWORD;

    const headers = new Headers({
      Authorization: "Basic " + btoa(username + ":" + password),
      "Content-Type": "application/x-www-form-urlencoded",
    });
    var url =
      domain_url +
      "/api/member/basic/from/" +
      (currentPaginationPage * this.state.itemsPerPage - 9) +
      "/count/" +
      this.state.itemsPerPage;

    var response = await fetch(url, {
      method: "get",
      headers: headers,
    });
    var data = await response.json();

    this.setState({
      persons: data,
      loading: false,
    });
  }

  render() {
    return (
      <div>
        <h2>Members</h2>

        {this.state.initialLoading === true ? (
          <>
            <Loading />
          </>
        ) : (
          <>
            {this.state.loading ? (
              <>
                <Loading />
              </>
            ) : (
              <>
                {this.state.persons ? (
                  <>
                    {this.state.persons.length < 1 ? (
                      <>No data found</>
                    ) : (
                      <>
                        <ul>
                          {this.state.persons.map((person, index) => (
                            <li key={person._id}>
                              <Person
                                username={person.username}
                                _id={person._id}
                                index={index}
                                signInType={person.signInType}
                              />
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </>
                ) : (
                  <>No data found</>
                )}
              </>
            )}
            <Pagination
              setCurrentPage={this.setCurrentPage}
              totalItems={this.state.totalItems}
              itemsPerPage={this.state.itemsPerPage}
            />
          </>
        )}
      </div>
    );
  }
}
