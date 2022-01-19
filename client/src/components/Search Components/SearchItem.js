import React, { Component } from "react";
import { Link } from "react-router-dom";

//css
import { Card } from "react-bootstrap";

//import functions
import { increaseGoogleProfilePictureSize } from "../../functions/increaseGoogleProfilePictureSize";

export default class SearchItem extends Component {
  render() {
    var {
      username,
      email,
      _id,
      firstName,
      lastName,
      middleName,
      profilePictureUrl,
      signInType,
    } = this.props;

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
      <Link to={`details/${_id}`}>
        <Card className="searchResultItemCard myBorder">
          <Card.Img variant="top" src={profilePictureUrl} />
          <Card.Body className="text-center">
            <div>Username: {username ? <>{username}</> : <>N/A</>}</div>

            <div>{this.props.createdAt}</div>
            {firstName || middleName || lastName ? (
              <>
                <div>
                  {firstName ? <>First name: {firstName}</> : null}
                  {lastName ? <>Last name: {lastName}</> : null}
                  {middleName ? <>Middle name: {middleName}</> : null}
                </div>
              </>
            ) : null}

            {email ? (
              <>
                <div>
                  {email.length === 1 ? (
                    <>
                      E-mail:{" "}
                      <a
                        href={`mailto: ${email[0]}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {email[0]}
                      </a>
                    </>
                  ) : (
                    <>
                      Email:
                      <ul>
                        {email.map((email, index) => (
                          <li key={email + index}>
                            <a
                              href={`mailto: ${email}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {email}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </>
            ) : null}
          </Card.Body>
        </Card>
      </Link>
    );
  }
}
