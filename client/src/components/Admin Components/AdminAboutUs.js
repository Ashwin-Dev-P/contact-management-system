import React, { Component } from "react";
import { Col, Row } from "react-bootstrap";
import axios from "axios";

//components
import Button from "../Button";
import AdminAdditionalLinks from "./AdminAdditionalLinks";

//Config
import { config } from "../../config.js";
import Loading from "../Loading";
const configData = config();
const domain_url = configData.EXPRESS_JS_SERVER_URL;

export default class AdminAboutUs extends Component {
  constructor(props) {
    super(props);

    this.addPerson = this.addPerson.bind(this);
    this.removePerson = this.removePerson.bind(this);
    this.onAboutChange = this.onAboutChange.bind(this);
    this.onNameChange = this.onNameChange.bind(this);
    this.onUrlChange = this.onUrlChange.bind(this);
    this.submitForm = this.submitForm.bind(this);

    this.getAboutUsData = this.getAboutUsData.bind(this);

    //Validation
    this.urlValidation = this.urlValidation.bind(this);
    this.otherDetailsValidation = this.otherDetailsValidation.bind(this);
    this.validation = this.validation.bind(this);

    var person = {
      picture_url: "",
      name: "",
      about: "",
      links: [],
    };
    this.state = {
      persons: [person],
      loading: true,
    };
  }

  async componentDidMount() {
    await this.getAboutUsData();
  }

  async getAboutUsData() {
    this.setState({
      loading: true,
    });

    const url = domain_url + "/api/about_us_singleton";

    //basic api authentication
    const username = process.env.REACT_APP_BASIC_AUTH_USERNAME;
    const password = process.env.REACT_APP_BASIC_AUTH_PASSWORD;

    const headers = {
      "Content-Type": "application/json",
      auth: {
        username: username,
        password: password,
      },
      //credentials: 'include',

      withCredentials: true,
    };
    await axios
      .get(url, headers)
      .then((response) => {
        if (response.status === 200 && response.data.status === 200) {
          const persons = response.data.data;
          this.setState({
            persons,
          });
        }

        this.setState({
          loading: false,
        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          error: true,
          error_message: "Some error occured while fetching data",
          loading: false,
        });
      });
  }

  async removePerson(index) {
    var persons = this.state.persons;
    persons.splice(index, 1);
    this.setState({
      persons,
    });
  }

  async addPerson() {
    var persons = this.state.persons;
    var person = {
      picture_url: "",
      name: "",
      about: "",
      links: [],
    };
    persons.push(person);
    this.setState({
      persons,
    });
  }

  async onAboutChange(index, e) {
    var persons = this.state.persons;
    persons[index].about = e.target.value;
    this.setState({
      persons,
    });
  }

  async onPictureChange(index, e) {
    var persons = this.state.persons;
    persons[index].picture_url = e.target.value;
    this.setState({
      persons,
    });
  }

  async onNameChange(index, e) {
    var persons = this.state.persons;
    persons[index].name = e.target.value;
    this.setState({
      persons,
    });
  }

  async onUrlChange(index, links) {
    var persons = this.state.persons;
    persons[index].links = links;
    this.setState({
      persons,
    });
  }

  async submitForm(e) {
    e.preventDefault();
    this.setState({
      submitting: true,
    });
    await this.validation();

    const url = domain_url + "/api/about_us_singleton";
    const form_data = {
      persons: this.state.persons,
    };

    //basic api authentication
    const username = process.env.REACT_APP_BASIC_AUTH_USERNAME;
    const password = process.env.REACT_APP_BASIC_AUTH_PASSWORD;

    const headers = {
      "Content-Type": "application/json",
      auth: {
        username: username,
        password: password,
      },
      //credentials: 'include',

      withCredentials: true,
    };
    await axios
      .post(url, form_data, headers)
      .then((response) => {
        this.setState({
          message: response.data.message,
        });

        if (response.status === 200 && response.data.status === 200) {
          this.setState({
            success: true,
          });
        }

        this.setState({
          submitting: false,
        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          error: true,
          error_message: "Some error occured",
          submitting: false,
        });
      });
  }

  async urlValidation(person_index) {
    const urls = this.state.persons[person_index].links;

    var filtered_urls = [];

    for (var i = 0; i < urls.length; i++) {
      var url = urls[i];
      if (!url.name && !url.url) {
        continue;
      } else if (!url.name || url.name.trim().length < 1) {
        this.setState({
          error: true,
          error_message: `Please enter the link name${i + 1} for the person ${
            person_index + 1
          }`,
        });
        return false;
      } else if (!url.url || url.url.trim().length < 1) {
        this.setState({
          error: true,
          error_message: `Please enter the url ${i + 1} for the person ${
            person_index + 1
          }`,
        });
        return false;
      } else {
        url.name = url.name.trim();
        url.url = url.url.trim();
        filtered_urls.push(url);
      }
    }

    var persons = this.state.persons;
    persons[person_index].links = filtered_urls;
    this.setState({
      error: false,
      persons,
    });
    return true;
  }

  async otherDetailsValidation(person_index) {
    var person = this.state.persons[person_index];
    person.name = person.name.trim();

    if (person.name.length < 1) {
      this.setState({
        error: true,
        error_message: `Please enter the name for the person ${
          person_index + 1
        }`,
      });
      return false;
    }
    return true;
  }

  async validation() {
    const persons = this.state.persons;

    for (var i = 0; i < persons.length; i++) {
      var valid = await this.otherDetailsValidation(i);
      if (!valid) {
        return false;
      }

      var validUrls = await this.urlValidation(i);

      if (!validUrls) {
        return false;
      }
    }
  }
  render() {
    return (
      <div>
        <Row>
          <Col xs={12} md={2} lg={3}></Col>

          <Col xs={12} md={8} lg={6} className="myDiv myBorder">
            <h2 className="myHeading">About Us</h2>

            {this.state.loading ? (
              <div className="text-center">
                <Loading />
              </div>
            ) : (
              <>
                <form onSubmit={this.submitForm}>
                  <div>
                    {this.state.persons.map((person, index) => (
                      <div key={index}>
                        <h3>Person{index + 1 > 1 ? index + 1 : ""}</h3>

                        <div className="form-group">
                          <label htmlFor={`picture${index}`}>Picture Url</label>
                          <input
                            type="url"
                            id={`picture${index}`}
                            className="form-control"
                            onChange={(e) => this.onPictureChange(index, e)}
                            value={person.picture_url}
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor={`name${index}`}>Name</label>
                          <input
                            id={`name${index}`}
                            className="form-control"
                            onChange={(e) => this.onNameChange(index, e)}
                            value={person.name}
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor={`about${index}`}>About</label>
                          <textarea
                            id={`about${index}`}
                            className="form-control"
                            onChange={(e) => this.onAboutChange(index, e)}
                            value={person.about}
                          ></textarea>
                        </div>
                        <AdminAdditionalLinks
                          person_number={index}
                          onUrlChange={this.onUrlChange}
                          urls={person.links}
                        />

                        {index ? (
                          <button
                            type="button"
                            style={{ width: "100%" }}
                            className="button remove btn btn-danger mt-2"
                            onClick={() => this.removePerson(index)}
                          >
                            Remove Person
                          </button>
                        ) : null}
                        <hr />
                      </div>
                    ))}
                  </div>
                  <div className="text-center mt-3">
                    <Button
                      className="btn btn-primary"
                      type="button"
                      text="Add person"
                      onClick={() => this.addPerson()}
                    ></Button>
                  </div>
                  <div className="text-center mt-3">
                    {this.state.submitting ? (
                      <>
                        <Button
                          className="btn btn-primary"
                          type="submit"
                          text="submit"
                          disabled={true}
                          loading={true}
                        />
                      </>
                    ) : (
                      <>
                        <Button
                          className="btn btn-primary"
                          type="submit"
                          text="submit"
                        />
                      </>
                    )}
                  </div>

                  {this.state.error ? (
                    <div className="error-div text-center mt-3 mb-3">
                      {this.state.error_message}
                    </div>
                  ) : null}

                  {this.state.message ? (
                    <>
                      {this.state.success ? (
                        <div className="success-div text-center mt-3 mb-3">
                          {this.state.message}
                        </div>
                      ) : (
                        <div className=" text-center mt-3 mb-3">
                          {this.state.message}
                        </div>
                      )}
                    </>
                  ) : null}
                </form>
              </>
            )}
          </Col>
        </Row>
      </div>
    );
  }
}
