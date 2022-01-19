import React, { Component } from "react";
import Loading from "../Loading";
import Button from "../Button";
export default class AdditionalUrl extends Component {
  constructor(props) {
    super(props);

    var url;
    if (this.props.url === undefined || this.props.url.length === 0) {
      url = [
        {
          urlTitle: "",
          url: "",
        },
      ];
    } else {
      url = this.props.url;
    }
    this.state = {
      url: url,
    };
  }

  //To update the url from the props received
  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      if (this.props.url !== undefined) {
        var url;
        if (this.props.url === undefined || this.props.url.length === 0) {
          url = [
            {
              name: "",
              url: "",
            },
          ];
        } else {
          url = this.props.url;
        }

        this.setState({
          url: url,
          loading: false,
        });
      }
    }
  }

  handleChange(i, e) {
    var url = this.state.url;

    url[i].urlTitle = e.target.value;
    this.setState({
      url: url,
    });
    this.props.setAdditionalUrl(url);
  }

  handleChange2(i, e) {
    var url = this.state.url;

    url[i].url = e.target.value;
    this.setState({
      url: url,
    });
    this.props.setAdditionalUrl(url);
  }

  addFormFields() {
    var url = this.state.url;
    url.push({
      urlTitle: "",
      url: "",
    });

    this.setState({
      url: url,
    });
  }

  removeFormFields(i) {
    var url = this.state.url;
    url.splice(i, 1);
    this.setState({
      url: url,
    });
  }

  render() {
    return (
      <div>
        <h3>Additional links</h3>
        <div>
          {this.state.loading === true ? (
            <>
              <Loading />{" "}
            </>
          ) : (
            <>
              {this.state.url ? (
                <>
                  {this.state.url.map((url, index) => (
                    <div key={index} className="mt-3">
                      <div>
                        <label htmlFor={`urlTitle${index}`}>
                          name{index + 1 > 1 ? index + 1 : ""}:
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          id={`urlTitle${index}`}
                          value={url.urlTitle || ""}
                          onChange={(e) => this.handleChange(index, e)}
                          autoComplete="on"
                        />
                      </div>

                      <div>
                        <label htmlFor={`url${index}`}>
                          Link{index + 1 > 1 ? index + 1 : ""}:
                        </label>
                        <input
                          className="form-control"
                          type="url"
                          id={`url${index}`}
                          value={url.url || ""}
                          onChange={(e) => this.handleChange2(index, e)}
                          autoComplete="on"
                        />
                      </div>
                      {index ? (
                        <>
                          <button
                            className="button remove btn btn-danger mt-2"
                            type="button"
                            onClick={() => this.removeFormFields(index)}
                          >
                            remove
                          </button>
                        </>
                      ) : null}
                    </div>
                  ))}
                </>
              ) : null}
              <div className="text-center mt-3">
                <Button
                  className="btn-primary"
                  type="button"
                  text="Add additional link"
                  onClick={() => this.addFormFields()}
                />
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
}
