import React, { Component } from "react";
import { Col, Row } from "react-bootstrap";

import { Redirect, Link, Route } from "react-router-dom";
//import functions
import { getCookie } from "../../functions/getCookie";

export default class AdminMain extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  async componentDidMount() {}

  render() {
    if (!getCookie("loggedIn") || !getCookie("admin")) {
      return <Redirect to="/login?redirectUrl=/admin/login" />;
    }

    return (
      <div>
        <Row>
          <Col xs={0} md={2} lg={3}></Col>
          <Col xs={12} md={8} lg={6}>
            <ul>
              <li className="text-center">
                <Link
                  className="btn btn-primary btnLink mb-3"
                  to="/admin/singleton"
                >
                  Singleton
                </Link>
              </li>
              <li className="text-center">
                <Link
                  className="btn btn-primary btnLink mb-3"
                  to="/admin/singleton/edit"
                >
                  Edit Singleton
                </Link>
              </li>
              <li className="text-center">
                <Link
                  className="btn btn-primary btnLink mb-3"
                  to="/admin/about_us"
                >
                  Edit About us
                </Link>
              </li>
              <li className="text-center">
                <Link
                  className="btn btn-primary btnLink mb-3"
                  to="/admin/client_details"
                >
                  View Client Details
                </Link>
              </li>
              <li className="text-center">
                <Link
                  className="btn btn-primary btnLink mb-3"
                  to="/admin/messages"
                >
                  View messages
                </Link>
              </li>
            </ul>
          </Col>
        </Row>
      </div>
    );
  }
}
