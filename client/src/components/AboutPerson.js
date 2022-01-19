import React, { Component } from "react";
import { Col, Row } from "react-bootstrap";

export default class AboutPerson extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.addDefaultSrc = this.addDefaultSrc.bind(this);
  }

  async addDefaultSrc(ev) {
    ev.target.src = "/assets/images/user5.webp";
  }

  render() {
    var { name, about, picture_url, links } = this.props.person;

    if (!picture_url) {
      picture_url = "/assets/images/user5.webp";
    }
    return (
      <div className="myDiv myBorder">
        <Row>
          <Col xs={12} md={4} lg={3} className="text-center">
            <img
              src={picture_url}
              className="about-us-img"
              alt={`${name}`}
              onError={this.addDefaultSrc}
            />
          </Col>
          <Col xs={12} md={8} lg={9}>
            <Row>
              <h3 className="text-center mt-3 align-middle">{name}</h3>
            </Row>

            {about ? (
              <Row className="mt-3 align-middle">
                <p>{about}</p>
              </Row>
            ) : null}

            {links && links.length > 0 ? (
              <Row>
                <ul>
                  {links.map((link) => (
                    <li key={link._id}>
                      <a href={link.url} target="_blank" rel="noreferrer">
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </Row>
            ) : null}
          </Col>
        </Row>
      </div>
    );
  }
}
