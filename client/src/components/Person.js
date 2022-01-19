import React, { Component } from "react";

import { BrowserRouter as Route, Link } from "react-router-dom";

//css
import { Card } from "react-bootstrap";

//import functions
import { increaseGoogleProfilePictureSize } from "../functions/increaseGoogleProfilePictureSize";

export default class Person extends Component {
  render() {
    var { username, _id, index, profilePictureUrl, signInType } = this.props;

    if (!profilePictureUrl) {
      profilePictureUrl = "assets/images/user5.webp";
    } else {
      if (signInType && signInType === "google") {
        profilePictureUrl = increaseGoogleProfilePictureSize(profilePictureUrl);
      } else {
        profilePictureUrl = profilePictureUrl || "assets/images/user5.webp";
      }
    }

    return (
      <Link to={`/details/${_id}`}>
        <Card className="myContactItem myBorder">
          <Card.Img
            variant="top"
            src={profilePictureUrl}
            alt="profile picture"
          />
          <Card.Body className="text-center">
            {username || `person${index + 1}`}
          </Card.Body>
        </Card>
      </Link>
    );
  }
}

Person.defaultProps = {
  name: "N/A",
  email: "N/A",
  phone_number: "N/A",
};
