import React, { Component } from "react";
import Button from "../Button";

export default class AdminAdditionalLinks extends Component {
  constructor(props) {
    super(props);

    this.addUrl = this.addUrl.bind(this);
    this.onUrlChange = this.onUrlChange.bind(this);
    this.removeUrl = this.removeUrl.bind(this);

    var url_object = {
      name: "",
      url: "",
    };
    this.state = {
      person_number: this.props.person_number || 0,
      urls: this.props.urls || [url_object],
    };
  }

  onUrlNameChange(index, e) {
    var urls = this.state.urls;
    urls[index].name = e.target.value;

    this.setState({
      urls,
    });
    this.props.onUrlChange(this.state.person_number, urls);
  }

  onUrlChange(index, e) {
    var urls = this.state.urls;
    urls[index].url = e.target.value;

    this.setState({
      urls,
    });

    this.props.onUrlChange(this.state.person_number, urls);
  }

  addUrl() {
    var url_object = {
      name: "",
      url: "",
    };

    var urls = this.state.urls;
    urls.push(url_object);

    this.setState({
      urls,
    });
  }

  removeUrl(index) {
    var urls = this.state.urls;
    urls.splice(index, 1);
    this.setState({
      urls,
    });
  }
  render() {
    return (
      <div>
        <h4>Links</h4>
        {this.state.urls.map((url, index) => (
          <div className="form-group" key={index}>
            <label htmlFor={`link_name${this.state.person_number}${index}`}>
              Link name{index + 1 > 1 ? index + 1 : ""}
            </label>
            <input
              className="form-control"
              type="text"
              id={`link_name${this.state.person_number}${index}`}
              value={url.name}
              onChange={(e) => this.onUrlNameChange(index, e)}
            />

            <label htmlFor={`link_url${this.state.person_number}${index}`}>
              Link url{index + 1 > 1 ? index + 1 : ""}
            </label>
            <input
              className="form-control"
              type="url"
              id={`link_url${this.state.person_number}${index}`}
              value={url.url}
              onChange={(e) => this.onUrlChange(index, e)}
            />

            {index ? (
              <button
                type="button"
                className="button remove btn btn-danger mt-2"
                onClick={() => this.removeUrl(index)}
              >
                Remove
              </button>
            ) : null}
          </div>
        ))}

        <div className="text-center mt-3">
          <Button
            className="btn btn-primary"
            type="button"
            text="Add link"
            onClick={() => this.addUrl()}
          ></Button>
        </div>
      </div>
    );
  }
}
