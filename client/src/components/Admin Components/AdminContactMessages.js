import React, { Component } from "react";
import Loading from "../Loading";
import axios from "axios";

//Config
import { config } from "../../config.js";
const configData = config();
const domain_url = configData.EXPRESS_JS_SERVER_URL;

export default class AdminContactMessages extends Component {
  constructor(props) {
    super(props);

    this.state = {
      limit: 10,
      skip: 0,
      messages: [],
    };
    this.loadMessages = this.loadMessages.bind(this);
    this.loadMore = this.loadMore.bind(this);
  }

  async loadMessages(skip) {
    this.setState({
      loading: true,
    });

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
      domain_url + `/api/contact/limit/${this.state.limit}/skip/${skip}`;
    axios
      .get(url, headers)
      .then((res) => {
        const status = res.status;
        if (status === 200) {
          this.setState({
            //messages: res.data,
            messages: [...this.state.messages, ...res.data],
            success: true,
          });

          //Setting the skip value(this is the correct way to skip so that load more will fetch data in case someone send message at the same time simultaneously)
          if (res.data.length > 0) {
            this.setState({
              skip: this.state.skip + res.data.length,
            });
          }
        }

        this.setState({
          loading: false,
        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          loading: false,
          error: true,
          message: "Unable to view messages. Some error occured",
        });
      });
  }

  async componentDidMount() {
    await this.loadMessages(this.state.skip);
  }

  loadMore() {
    //var skip = parseInt(this.state.messages.length / this.state.limit) * 10;
    const skip = this.state.skip;
    this.loadMessages(skip);
  }
  render() {
    return (
      <div className="myDiv myBorder">
        <h2 className="myHeading">Messages</h2>

        {this.state.error ? (
          <div className="mt-3 mb-3 error-div text-center">
            {this.state.message}
          </div>
        ) : null}
        <div>
          <div>
            <table className="table table-bordered table-striped myBorder">
              <thead>
                <tr>
                  <th>S.no</th>
                  <th>Name</th>
                  <th>Message</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {this.state.success &&
                  this.state.messages.map((message, index) => (
                    <tr key={message._id}>
                      <td>{index + 1}</td>
                      <td>{message.name}</td>
                      <td>{message.message}</td>
                      <td>
                        {new Intl.DateTimeFormat("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "2-digit",
                        }).format(new Date(Date.parse(message.createdAt)))}
                      </td>
                    </tr>
                  ))}
              </tbody>
              <tfoot></tfoot>
            </table>
            {this.state.loading ? (
              <div className="mb-3 mt-3 text-center">
                <Loading />
              </div>
            ) : null}

            <div className="text-center">
              <button className="btn btn-primary" onClick={this.loadMore}>
                Load more
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
