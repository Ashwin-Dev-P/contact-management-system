import React, { Component } from "react";
import axios from "axios";
import Loading from "./Loading";
import Person from "./Person";

//Config
import { config } from "../config.js";
import { Col, Row } from "react-bootstrap";
const configData = config();
const domain_url = configData.EXPRESS_JS_SERVER_URL;

export default class AllMembers extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      loading: true,
      page: 1,
      itemsPerPage: 10,
    };
  }

  async componentDidMount() {
    //Fetch initial data when component is mounted
    this.getData(this.state.page);

    var options = {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    };

    //Used to observe if we have scrolled to the bottom
    this.observer = new IntersectionObserver(
      this.handleObserver.bind(this),
      options
    );
    this.observer.observe(this.loadingRef);
  }

  //Used to observe if we have scrolled to the bottom
  handleObserver(entities) {
    var y = entities[0].boundingClientRect.y;

    var curPage;

    if (y < window.innerHeight) {
      curPage = parseInt(this.state.page) + 1;
      this.getData(curPage);
      this.setState({ page: curPage });
    }
    this.setState({ prevY: y });
  }

  //Used to fetch data
  getData(page) {
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

    const url =
      domain_url +
      "/api/member/basic/from/" +
      (this.state.page * this.state.itemsPerPage - 9) +
      "/count/" +
      this.state.itemsPerPage;
    axios
      .get(url, headers)
      .then((res) => {
        this.setState({ data: [...this.state.data, ...res.data] });
        this.setState({ loading: false });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    // To change the loading icon behavior. The loading icon will disappear if all the values from the database is done showing.
    const loadingTextCSS = { display: this.state.loading ? "block" : "none" };

    return (
      <div>
        <h2 className="myHeading">Members</h2>
        <div>
          <ul>
            <Row>
              {this.state.data.map((user, index) => (
                <Col
                  key={index}
                  xs={12}
                  md={6}
                  lg={4}
                  xl={3}
                  className="zoomOnHover"
                >
                  <li>
                    <Person
                      _id={user._id}
                      username={user.username}
                      index={index}
                      profilePictureUrl={user.profilePictureUrl}
                      signInType={user.signInType}
                    />
                  </li>
                </Col>
              ))}
            </Row>
          </ul>
        </div>

        <div ref={(loadingRef) => (this.loadingRef = loadingRef)}>
          <span style={loadingTextCSS} className="text-center">
            <Loading />
          </span>
        </div>
      </div>
    );
  }
}
