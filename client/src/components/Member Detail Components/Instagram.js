import React, { Component } from "react";
export default class Instagram extends Component {
  render(props) {
    //Check if any instagram account is available

    if (
      !this.props.instagram_usernames ||
      this.props.instagram_usernames.length === 0
    ) {
      return (
        <div>
          <div>Instagram:</div>
          <div>Not available</div>
        </div>
      );
    }

    if (this.props.instagram_usernames.length === 1) {
      return (
        <div>
          <div>Instagram:</div>
          <div>
            <a
              target="_blank"
              rel="noreferrer"
              href={`https://instagram.com/${this.props.instagram_usernames[0]}`}
            >
              {this.props.instagram_usernames[0]}
            </a>
          </div>
        </div>
      );
    }

    return (
      <div>
        <div>Instagram:</div>
        <div>
          <ul>
            {this.props.instagram_usernames.map((instagram_username, index) => (
              <li key={index}>
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={`https://instagram.com/${instagram_username}`}
                >
                  {instagram_username}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}
