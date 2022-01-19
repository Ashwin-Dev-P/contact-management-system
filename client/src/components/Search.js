import React, { Component } from "react";
import axios from "axios";

//CSS
import { Row, Col, Form } from "react-bootstrap";

//Components
import Loading from "./Loading.js";
import Button from "./Button";
import SearchItem from "./Search Components/SearchItem";
import CompanySearchItem from "./Search Components/CompanySearchItem.js";
import CollegeSearchItem from "./Search Components/CollegeSearchItem.js";
import SchoolSearchItem from "./Search Components/SchoolSearchItem.js";

//Config
import { config } from "../config.js";

const configData = config();
const domain_url = configData.EXPRESS_JS_SERVER_URL;

//Cancel axios request
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

export default class Search extends Component {
  constructor(props) {
    super(props);

    this.changeHandler = this.changeHandler.bind(this);
    this.handleSearchTypeChange = this.handleSearchTypeChange.bind(this);
    this.handleSearchByChange = this.handleSearchByChange.bind(this);
    this.loadMore = this.loadMore.bind(this);

    var searchType = [
      { name: "Account", value: "member" },
      { name: "College", value: "college" },
      { name: "School", value: "school" },
      { name: "Company", value: "company" },
    ];

    //For accounts
    var accountSearchBy = [
      { name: "username", value: "username" },
      { name: "First name", value: "firstName" },
      { name: "Middle name", value: "middleName" },
      { name: "Last name", value: "lastName" },
      { name: "E-mail", value: "email" },
    ];

    //For colleges
    var collegeSearchBy = [{ name: "College name", value: "collegeName" }];

    //For schools
    var schoolSearchBy = [{ name: "School name", value: "schoolName" }];

    //Company
    var companySearchBy = [{ name: "Company Name", value: "companyName" }];

    this.state = {
      searchType,

      //Account
      accountSearchBy,

      //College
      collegeSearchBy,

      //School
      schoolSearchBy,

      //Company
      companySearchBy,

      //Intial values
      searchBy: accountSearchBy,

      page: 1,
      prevSearch: "",
      uniqueDataId: [],
    };
  }

  async loadMore() {
    var page = parseInt(this.state.page) + 1;
    this.setState({
      page: page,
    });
    this.changeHandler(page);
  }

  async changeHandler(page) {
    //Cancel previous request if a new value is entered.
    if (this.state.loading === true) {
      source.cancel("Operation canceled by the user.");

      this.setState({
        loading: false,
      });
    }

    //Setting the dataType, so it can be viewed appropriately in the search results
    var searchType = document.getElementById("searchType").value.trim();
    var dataType = searchType;
    this.setState({
      dataType,
    });

    //State changes when search starts
    this.setState({
      loading: true,
      //dataFound: false
    });

    //Form data
    var search = document.getElementById("search").value;
    search = search.trim();

    //New search means all the initial values need to be reset
    if (this.state.prevSearch !== search) {
      this.setState({
        prevSearch: search,
        data: [],
        uniqueDataId: [],
        page: 1,
      });
    }

    var searchBy = document.getElementById("searchBy").value.trim();

    if (searchBy === "username" || searchBy === "email") {
      //Remove spaces between search
      search = search.replace(/\s/g, "");
    }

    var form_data;

    //Bug fix for filter on changing search type
    var found;
    var i = 0;
    if (searchType === "member") {
      var accountSearchBy = this.state.accountSearchBy;
      found = false;
      for (i = 0; i < accountSearchBy.length; i++) {
        if (accountSearchBy[i].value === searchBy) {
          found = true;
          break;
        }
      }
      if (!found) {
        searchBy = accountSearchBy[0].value;
      }
    } else if (searchType === "company") {
      var companySearchBy = this.state.companySearchBy;
      found = false;
      for (i = 0; i < companySearchBy.length; i++) {
        if (companySearchBy[i].value === searchBy) {
          found = true;
          break;
        }
      }
      if (!found) {
        searchBy = companySearchBy[0].value;
      }
    } else if (searchType === "college") {
      var collegeSearchBy = this.state.collegeSearchBy;
      found = false;
      for (i = 0; i < collegeSearchBy.length; i++) {
        if (collegeSearchBy[i].value === searchBy) {
          found = true;
          break;
        }
      }
      if (!found) {
        searchBy = collegeSearchBy[0].value;
      }
    } else if (searchType === "school") {
      var schoolSearchBy = this.state.schoolSearchBy;
      found = false;
      for (i = 0; i < schoolSearchBy.length; i++) {
        if (schoolSearchBy[i].value === searchBy) {
          found = true;
          break;
        }
      }
      if (!found) {
        searchBy = schoolSearchBy[0].value;
      }
    }

    if (!found) {
      this.setState({
        page: 1,
        data: [],
        uniqueDataId: [],
      });
    }

    form_data = {
      search,
      searchBy,
      page: page || this.state.page,
    };

    //AXIOS
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

    const url = domain_url + "/api/" + searchType + "/search";

    axios
      .post(url, form_data, headers, {
        cancelToken: source.token,
      })
      .then((response) => {
        const status = response.status;

        //Checking axios status
        if (status === 200) {
          //Checking node js server result status
          if (response.data.status === 200) {
            if (!this.state.data) {
              this.setState({
                data: [],
                uniqueDataId: [],
              });
            }

            if (response.data.data.length > 0) {
              //Store new values in data wihtout duplicate
              const receivedData = response.data.data;
              const uniqueData = [];
              var uniqueDataId = this.state.uniqueDataId;
              for (var i = 0; i < receivedData.length; i++) {
                //uniqueness using _id
                if (uniqueDataId.indexOf(receivedData[i]._id) === -1) {
                  uniqueDataId.push(receivedData[i]._id);
                  uniqueData.push(receivedData[i]);
                }

                /*
                            if(this.state.data.indexOf(receivedData[i]) === -1 &&  uniqueData.indexOf(receivedData[i]) === -1  ){
                                uniqueData.push(receivedData[i])
                            }
                            */
              }

              //Add the unique values to the state data
              this.setState({
                // data: [...this.state.data, ...response.data.data]
                data: [...this.state.data, ...uniqueData],
              });
            } else if (page > 1 || this.state.page > 1) {
              this.setState({
                page: page - 1 || this.state.page - 1,
              });
            }

            this.setState({
              dataFound: true,
            });
          } else {
            this.setState({
              dataFound: false,
            });
          }
        } else {
          this.setState({
            dataFound: false,
          });
        }

        //Stop loading regardless of the positive/negative response
        this.setState({
          loading: false,
        });

        //If no data is found , then set 'dataFound' to 'false'
        if (!this.state.data || this.state.data.length < 1) {
          this.setState({
            dataFound: false,
          });
        }
      })
      .catch((error) => {
        console.log(error);

        //Stop loading if error, and set 'dataFound' to 'false'
        this.setState({
          loading: false,
          dataFound: false,
        });
      });
  }

  handleSearchByChange = (e) => {
    this.setState({
      searchByEmail: e.target.value,
      data: [],
      uniqueDataId: [],
      page: 1,
    });

    this.changeHandler(1);
  };

  //Show additional options depending upon the account type selected
  handleSearchTypeChange = (e) => {
    //this.changeHandler();

    var searchType = document.getElementById("searchType").value;

    //Setting the dataType, so it can be viewed appropriately in the search results
    var dataType = searchType;
    this.setState({
      dataType,
      data: [],
      uniqueDataId: [],
      page: 1,
    });

    if (searchType === "member") {
      this.setState({
        searchBy: this.state.accountSearchBy,
      });
    } else if (searchType === "college") {
      this.setState({
        searchBy: this.state.collegeSearchBy,
      });
    } else if (searchType === "school") {
      this.setState({
        searchBy: this.state.schoolSearchBy,
      });
    } else if (searchType === "company") {
      this.setState({
        searchBy: this.state.companySearchBy,
      });
    }

    this.changeHandler(1);
  };

  render() {
    return (
      <div className="searchWholeComponent">
        <Row className="myBorder" id="searchSettingDiv">
          <h2 className="myHeading">Search</h2>
          {this.state.searchBy.value}
          <Col xs={12} md={4}>
            <label htmlFor="search">Search</label>
            <input
              className="form-control"
              type="search"
              id="search"
              placeholder="Search"
              onChange={(e) => this.changeHandler()}
              autoFocus
            />
          </Col>
          <Col xs={12} md={4}>
            <label htmlFor="searchType">Search Type</label>
            <Form.Select
              id="searchType"
              onChange={(e) => this.handleSearchTypeChange(e)}
            >
              {this.state.searchType &&
                this.state.searchType.map((searchType) => (
                  <option key={searchType.value} value={searchType.value}>
                    {searchType.name}
                  </option>
                ))}
            </Form.Select>
          </Col>

          <Col xs={12} md={4}>
            <label htmlFor="searchBy">Search by</label>
            <Form.Select
              id="searchBy"
              onChange={(e) => this.handleSearchByChange(e)}
              defaultValue={this.state.searchBy[0].value}
            >
              {this.state.searchBy &&
                this.state.searchBy.map((searchBy, index) => (
                  <option key={searchBy.value} value={searchBy.value}>
                    {searchBy.name}
                  </option>
                ))}
            </Form.Select>
          </Col>
        </Row>

        <Row id="searchResultDiv" className="">
          <Col>
            <div>
              {this.state.dataFound === undefined ? (
                <div
                  style={{
                    textAlign: "center",
                    margin: "2% 0% 0% 0%",
                    paddingBottom: "2%",
                  }}
                >
                  Start searching
                </div>
              ) : (
                <>
                  {this.state.searchCount === 0 ? (
                    <>
                      <Loading />
                    </>
                  ) : (
                    <>
                      {this.state.dataFound === true ? (
                        <>
                          <ul>
                            <Row>
                              {this.state.dataType === "member" &&
                                this.state.data.map((member, index) => (
                                  <Col
                                    key={member._id + index}
                                    xs={12}
                                    md={6}
                                    lg={4}
                                  >
                                    <SearchItem
                                      username={member.username}
                                      firstName={member.first_name}
                                      middleName={member.middle_name}
                                      lastName={member.last_name}
                                      _id={member._id}
                                      email={member.email}
                                      profilePictureUrl={
                                        member.profilePictureUrl
                                      }
                                      signInType={member.signInType}
                                    />
                                  </Col>
                                ))}

                              {this.state.dataType === "company" &&
                                this.state.data.map((company, index) => (
                                  <li key={company._id + index}>
                                    <CompanySearchItem
                                      name={company.name}
                                      _id={company._id}
                                    />
                                  </li>
                                ))}

                              {this.state.dataType === "college" &&
                                this.state.data.map((college, index) => (
                                  <li key={college._id + index}>
                                    <CollegeSearchItem
                                      name={college.name}
                                      _id={college._id}
                                    />
                                  </li>
                                ))}

                              {this.state.dataType === "school" &&
                                this.state.data.map((school, index) => (
                                  <li key={school._id + index}>
                                    <SchoolSearchItem
                                      name={school.name}
                                      _id={school._id}
                                    />
                                  </li>
                                ))}
                            </Row>
                          </ul>
                          {this.state.loading ? (
                            <div className="text-center">
                              <Loading />
                            </div>
                          ) : null}
                          <Button
                            className="btn-primary"
                            text="Load more"
                            type="button"
                            onClick={this.loadMore}
                          />
                        </>
                      ) : (
                        <div
                          style={{
                            textAlign: "center",
                            margin: "2% 0% 0% 0%",
                            paddingBottom: "2%",
                          }}
                        >
                          No data found
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
