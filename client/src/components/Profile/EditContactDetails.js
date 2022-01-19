import React, { Component } from "react";
import axios from "axios";
import validator from "validator";

//Components
import Loading from "../Loading";
import Button from "../Button";
import DynamicEmail from "../Register Components/DynamicEmail";
import DynamicContactNumber from "../Register Components/DynamicContactNumber";
import DynamicWhatsApp from "../Register Components/DynamicWhatsApp";
import DynamicInstagram from "../Register Components/DynamicInstagram";
import DynamicFacebook from "../Register Components/DynamicFacebook";
import DynamicLinkedIn from "../Register Components/DynamicLinkedIn";
import DynamicTelegram from "../Register Components/DynamicTelegram";
import DynamicTwitter from "../Register Components/DynamicTwitter";
import DynamicYouTube from "../Register Components/DynamicYouTube";
import DynamicSnapChat from "../Register Components/DynamicSnapChat";
import AdditionalUrl from "../Register Components/AdditionalUrl";

import { getCookie } from "../../functions/getCookie";

//Config
import { config } from "../../config.js";
import { Redirect } from "react-router";
import { Col, Row } from "react-bootstrap";

//import { response } from 'express';
const configData = config();
const domain_url = configData.EXPRESS_JS_SERVER_URL;

const SITE_KEY = process.env.REACT_APP_SITE_KEY;

export default class EditContactDetails extends Component {
  constructor(props) {
    super(props);

    this.setEmail = this.setEmail.bind(this);
    this.setNumber = this.setNumber.bind(this);
    this.setWhatsApp = this.setWhatsApp.bind(this);
    this.setInstagram = this.setInstagram.bind(this);
    this.setLinkedIn = this.setLinkedIn.bind(this);
    this.setTelegram = this.setTelegram.bind(this);
    this.setTwitter = this.setTwitter.bind(this);
    this.setFacebook = this.setFacebook.bind(this);
    this.setYouTube = this.setYouTube.bind(this);
    this.setSnapChat = this.setSnapChat.bind(this);
    this.setAdditionalUrl = this.setAdditionalUrl.bind(this);

    this.validNumbers = this.validNumbers.bind(this);
    this.validTwitter = this.validTwitter.bind(this);
    this.validTwitterHandle = this.validTwitterHandle.bind(this);
    this.submitData = this.submitData.bind(this);
    this.submitHandler = this.submitHandler.bind(this);

    this.state = {
      email: "",
    };
  }

  async setEmail(email) {
    this.setState({
      email,
    });
  }

  async setNumber(numbers) {
    this.setState({
      numbers,
    });
  }
  async setWhatsApp(whatsApp) {
    this.setState({
      whatsApp,
    });
  }

  async setInstagram(instagrams) {
    this.setState({
      instagrams,
    });
  }

  async setLinkedIn(linkedIn) {
    this.setState({
      linkedIn,
    });
  }

  async setTelegram(telegram) {
    this.setState({
      telegram,
    });
  }

  async setTwitter(twitter) {
    this.setState({
      twitter,
    });
  }

  async setFacebook(facebook) {
    this.setState({
      facebook,
    });
  }

  async setYouTube(youtube) {
    this.setState({
      youtube,
    });
  }

  async setSnapChat(snapchat) {
    this.setState({
      snapchat,
    });
  }

  async setAdditionalUrl(url) {
    this.setState({
      url,
    });
  }

  async componentDidMount() {
    if (getCookie("loggedIn") !== "true") {
      const redirectUrl = "/login?redirectUrl=/account/edit_contact_details/";
      this.setState({
        redirectUrl: redirectUrl,
        loggedIn: false,
      });

      return false;
    }
    this.setState({
      loggedIn: true,
    });

    //basic api authentication
    const username = process.env.REACT_APP_BASIC_AUTH_USERNAME;
    const password = process.env.REACT_APP_BASIC_AUTH_PASSWORD;

    const headers = {
      "Content-Type": "application/json",
      auth: {
        username: username,
        password: password,
      },
      credentials: "include",
      withCredentials: true,
    };
    const url = domain_url + "/api/member/contact_details";

    axios
      .get(url, headers)
      .then((response) => {
        if (response.status === 200) {
          const data = response.data.data;
          this.setState({
            data: response.data.data,
            emails: response.data.data.email,
            email: response.data.data.email,
          });

          if (data.contact_number) {
            this.setState({
              numbers: response.data.data.contact_number,
            });
          }
          if (data.social_media) {
            if (data.social_media.whatsapp) {
              this.setState({
                whatsApp: response.data.data.social_media.whatsapp,
              });
            }
            if (data.social_media.instagram_username) {
              this.setState({
                instagrams: data.social_media.instagram_username,
              });
            }
            if (data.social_media.linkedin_url) {
              this.setState({
                linkedIn: data.social_media.linkedin_url,
              });
            }
            if (data.social_media.telegram) {
              this.setState({
                telegram: data.social_media.telegram,
              });
            }

            if (data.social_media.twitter_username) {
              this.setState({
                twitter: data.social_media.twitter_username,
              });
            }
            if (data.social_media.facebook_url) {
              this.setState({
                facebook: data.social_media.facebook_url,
              });
            }

            if (data.social_media.youtube_channel_url) {
              this.setState({
                youtube: data.social_media.youtube_channel_url,
              });
            }

            if (data.social_media.snapchat_username) {
              this.setState({
                snapchat: data.social_media.snapchat_username,
              });
            }

            if (data.social_media.additional_url) {
              this.setState({
                url: data.social_media.additional_url,
              });
            }
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
    this.setState({
      loading: false,
    });
  }

  submitData = (submit_button, info_div, form_data) => {
    window.grecaptcha.ready(() => {
      window.grecaptcha
        .execute(SITE_KEY, { action: "submit" })
        .then((token) => {
          if (!token) {
            info_div.innerHTML = "reCAPTCHA error";
            submit_button.disabled = false;
            return false;
          }

          alert(JSON.stringify(form_data));
          const tokenRecieved = token;
          form_data.reCAPTCHAToken = tokenRecieved;

          //basic api authentication
          var username = process.env.REACT_APP_BASIC_AUTH_USERNAME;
          var password = process.env.REACT_APP_BASIC_AUTH_PASSWORD;

          const headers = {
            "Content-Type": "application/json",
            auth: {
              username: username,
              password: password,
            },
            //credentials: 'include',
            withCredentials: true,
          };

          //Info div
          var info_div = document.getElementById("info");
          info_div.innerHTML = "Registering details..Please wait...";

          const url = domain_url + "/api/member/contact_details";
          axios
            .patch(url, form_data, headers)
            .then((response) => {
              info_div.innerHTML = response.data.message;
              submit_button.disabled = false;

              if (response.data.status !== 200) {
                if (response.data.message) {
                  info_div.innerHTML = response.data.message;
                  submit_button.disabled = false;
                  return false;
                }
                info_div.innerHTML = "Unable to update contact details";
                submit_button.disabled = false;
              }
            })
            .catch((error) => {
              console.log("error message", error);
              info_div.innerHTML =
                "Unable to register.Please contact us for details.";
              submit_button.disabled = false;
            });
          submit_button.disabled = false;
        });
    });
  };

  validNumbers(numbers, type, info_div) {
    if (numbers) {
      var validNumbers = [];

      for (var i = 0; i < numbers.length; i++) {
        let current_number = String(numbers[i].number).trim();
        let current_country_code = String(numbers[i].country_code).trim();

        if (current_number.length < 1) {
          info_div.innerHTML = "Enter the " + type + " field " + (i + 1);
          validNumbers = false;
          break;
        } else if (current_country_code.length < 1) {
          info_div.innerHTML =
            "Enter the " + type + " country code field " + (i + 1);
          validNumbers = false;
          break;
        } else if (current_country_code.length > 5) {
          info_div.innerHTML =
            "Country code '" +
            current_country_code +
            "' is invalid. Please enter a valid country code in " +
            type +
            i;
          validNumbers = false;
          break;
        } else {
          validNumbers.push(numbers[i]);
        }
      }

      return validNumbers;
    }
    return true;
  }

  validInstagrams(info_div) {
    var instagrams = this.state.instagrams;
    if (instagrams) {
      var validInstagrams = [];
      var regex = /^[\w](?!.*?\.{2})[\w.]{1,28}[\w]$/;
      for (var i = 0; i < instagrams.length; i++) {
        var current_instagram = instagrams[i].trim();

        if (current_instagram.length > 0) {
          if (current_instagram.length > 30) {
            info_div.innerHTML =
              "Invalid instagram username " +
              (i + 1) +
              ". Username can have a maximum length of 30 characters only";
            return false;
          }

          if (!regex.test(current_instagram)) {
            info_div.innerHTML = "Invalid instagram username " + (i + 1);
            return false;
          }
          validInstagrams.push(current_instagram);
        }
      }
      return validInstagrams;
    }
    return true;
  }

  validSnapchat(info_div) {
    var snapchat = this.state.snapchat;
    if (snapchat) {
      var validSnapchat = [];
      var regex = /^[a-zA-Z][\w-_.]{1,13}[\w]$/;
      for (var i = 0; i < snapchat.length; i++) {
        var current_snapchat = snapchat[i].trim();

        if (current_snapchat.length > 0) {
          if (current_snapchat.length > 15) {
            info_div.innerHTML =
              "Invalid snapchat username " +
              (i + 1) +
              ". Username can have a maximum length of 15 characters only";
            return false;
          }

          if (!regex.test(current_snapchat)) {
            info_div.innerHTML = "Invalid snapchat username " + (i + 1);
            return false;
          }
          validSnapchat.push(current_snapchat);
        }
      }
      return validSnapchat;
    }
    return true;
  }

  validUrl(url) {
    const regex = new RegExp(
      "(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?"
    );
    return regex.test(url);
  }

  //Function to check an array of valid urls
  validLinks(data, name, info_div) {
    var links = data;
    if (links) {
      var validLinks = [];
      for (var i = 0; i < links.length; i++) {
        var currentLink = links[i];
        if (currentLink) {
          currentLink = currentLink.trim();
        }

        if (currentLink.length < 1) {
          continue;
        }
        var valid = this.validUrl(currentLink);
        if (!valid) {
          info_div.innerHTML =
            "Enter a valid " + name + " url in input " + (i + 1);
          return false;
        }
        validLinks.push(currentLink);
      }
      return validLinks;
    }
    return [];
  }

  validLinkedIn(info_div) {
    var linkedIn = this.state.linkedIn;

    if (linkedIn) {
      var validLinkedIn = [];
      for (var i = 0; i < linkedIn.length; i++) {
        const currentLinkedIn = linkedIn[i].trim();

        if (currentLinkedIn.length < 1) {
          continue;
        }

        var valid = this.validUrl(currentLinkedIn);
        if (!valid) {
          info_div.innerHTML = "Enter a valid linkedIn url in input " + (i + 1);
          return false;
        }
        validLinkedIn.push(currentLinkedIn);
      }
      return validLinkedIn;
    }
    return true;
  }

  validTelegram(info_div) {
    if (this.state.telegram) {
      var telegrams = this.state.telegram;
      var validTelegram = [];
      for (var i = 0; i < telegrams.length; i++) {
        var current_telegram = telegrams[i];
        var current_country_code = String(
          current_telegram.number.country_code
        ).trim();
        var current_number = String(current_telegram.number.number).trim();
        var current_telegram_username = current_telegram.username;
        if (
          current_number.length < 1 &&
          current_country_code.length < 1 &&
          current_telegram_username.length < 1
        ) {
          continue;
        }
        //Both the country code and number must be present. Else nothing must be present. Otherwise invalid data
        else if (
          (current_number.length < 1 && !current_country_code.length < 1) ||
          (!current_number.length < 1 && current_country_code.length < 1)
        ) {
          info_div.innerHTML =
            "Enter both the telegram country code and number " + (i + 1);
          return false;
        }

        if (
          current_telegram_username.length > 0 &&
          current_telegram_username.length < 5
        ) {
          info_div.innerHTML =
            "Enter a valid telegram username " +
            (i + 1) +
            " . Telegram username must be a minimum of 5 characters";
          return false;
        }

        validTelegram.push(current_telegram);
      }
      return validTelegram;
    }
    return true;
  }

  validTwitterHandle(twitterHandle) {
    const twitterHandleRegex = /^@?(\w){1,15}$/;
    return twitterHandleRegex.test(twitterHandle);
  }

  validTwitter(info_div) {
    var twitter = this.state.twitter;
    if (twitter) {
      var validTwitter = [];
      for (var i = 0; i < twitter.length; i++) {
        var currentTwitter = twitter[i].trim();
        if (currentTwitter.length < 1) {
          continue;
        } else if (currentTwitter.length < 4 || currentTwitter.length > 15) {
          info_div.innerHTML =
            "Twitter username " + currentTwitter + " is invalid";
          return false;
        } else if (this.validTwitterHandle(currentTwitter)) {
          validTwitter.push(currentTwitter);
        } else {
          info_div.innerHTML =
            "Twitter username " + currentTwitter + " is invalid";
          return false;
        }
      }
      return validTwitter;
    }
    return true;
  }

  validAdditionalUrl(info_div) {
    var url = this.state.url;
    if (url) {
      const validUrls = [];
      for (var i = 0; i < url.length; i++) {
        var currentUrlName = url[i].urlTitle;
        var currentUrl = url[i].url;

        //Skip the input values which are empty ob both the url and its corresponding name
        if (
          (!currentUrlName && !currentUrl) ||
          (currentUrlName.length < 1 && currentUrl.length < 1)
        ) {
          continue;
        } else if (currentUrlName.length < 1) {
          info_div.innerHTML =
            "Please enter a name for the link in the additonal url " + (i + 1);
          return false;
        } else if (currentUrl.length < 1) {
          info_div.innerHTML =
            "Please enter a url for the link in the additonal url " + (i + 1);
          return false;
        } else if (!this.validUrl(currentUrl)) {
          info_div.innerHTML =
            "Please enter a valid url for the link in the additonal url " +
            (i + 1);
          return false;
        } else {
          validUrls.push(url[i]);
        }
      }
      return validUrls;
    }
    return [];
  }

  submitHandler = (e) => {
    e.preventDefault();

    //Disable submit button in the mean time
    var submit_button = document.getElementById("submit");
    submit_button.disabled = true;

    //Info div
    var info_div = document.getElementById("info");
    info_div.innerHTML = "Validating details..Please wait...";

    //Email validation
    //Store emails in an array
    var valid_email = true;
    const email_array = [];
    for (var i = 0; i < this.state.email.length; i++) {
      let current_email = this.state.email[i].trim();

      if (current_email.length < 1) {
        info_div.innerHTML = "Enter the email field " + (i + 1);
        valid_email = false;
        break;
      } else if (!validator.isEmail(current_email)) {
        info_div.innerHTML =
          "Email '" +
          current_email +
          "' is invalid. Please enter a valid email";
        valid_email = false;
        break;
      } else {
        email_array.push(current_email);
      }
    }

    if (valid_email) {
      var validNumbers = true;
      validNumbers = this.validNumbers(this.state.numbers, "number", info_div);

      if (validNumbers) {
        var validWhatsApp = this.validNumbers(
          this.state.whatsApp,
          "whatsapp",
          info_div
        );
        if (validWhatsApp) {
          var validInstagrams = this.validInstagrams(info_div);
          if (validInstagrams) {
            var validLinkedIn = this.validLinkedIn(info_div);
            if (validLinkedIn) {
              var validTelegram = this.validTelegram(info_div);

              if (validTelegram) {
                var validTwitter = this.validTwitter(info_div);
                if (validTwitter) {
                  var validFacebook = this.validLinks(
                    this.state.facebook,
                    "facebook",
                    info_div
                  );
                  if (validFacebook) {
                    var validYouTube = this.validLinks(
                      this.state.youtube,
                      "youtube",
                      info_div
                    );
                    if (validYouTube) {
                      var validSnapchat = this.validSnapchat(info_div);

                      if (validSnapchat) {
                        var validAdditionalUrl =
                          this.validAdditionalUrl(info_div);

                        if (validAdditionalUrl) {
                          if (validNumbers === true) {
                            validNumbers = [];
                          }
                          if (validTelegram === true) {
                            validTelegram = [];
                          }
                          if (validLinkedIn === true) {
                            validTelegram = [];
                          }
                          if (validWhatsApp === true) {
                            validWhatsApp = [];
                          }
                          if (validInstagrams === true) {
                            validInstagrams = [];
                          }
                          if (validNumbers === true) {
                            validNumbers = [];
                          }
                          if (validTwitter === true) {
                            validTwitter = [];
                          }
                          var form_data = {
                            email: email_array,
                            contact_numbers: validNumbers,
                            social_media: {
                              whatsapp: validWhatsApp,
                              instagram_username: validInstagrams,
                              linkedin_url: validLinkedIn,
                              telegram: validTelegram,
                              twitter_username: validTwitter,
                              facebook_url: validFacebook,
                              youtube_channel_url: validYouTube,
                              snapchat_username: validSnapchat,
                              additional_url: validAdditionalUrl,
                            },
                          };
                          this.submitData(submit_button, info_div, form_data);
                        }
                      } else {
                        submit_button.disabled = false;
                      }
                    } else {
                      submit_button.disabled = false;
                    }
                  }
                } else {
                  submit_button.disabled = false;
                }
              } else {
                submit_button.disabled = false;
              }
            } else {
              submit_button.disabled = false;
            }
          } else {
            submit_button.disabled = false;
          }
        } else {
          submit_button.disabled = false;
        }
      } else {
        submit_button.disabled = false;
      }
    } else {
      submit_button.disabled = false;
    }
    submit_button.disabled = false;
  };

  render() {
    if (this.state.redirectUrl && this.state.loggedIn === false) {
      const path = this.state.redirectUrl;
      return <Redirect to={path} />;
    }

    return (
      <div>
        <Row className="">
          <Col xs={12} md={2} lg={4}></Col>
          <Col
            xs={12}
            md={8}
            lg={4}
            id="editContactDetailsForm"
            className="myBorder"
          >
            <h2 className="myHeading">Edit Contact details</h2>
            <hr />
            <div>
              {this.state.loading === true ? (
                <>
                  <Loading />
                </>
              ) : (
                <>
                  <form onSubmit={this.submitHandler}>
                    <DynamicEmail
                      setEmail={this.setEmail}
                      emails={this.state.emails}
                    />
                    <hr />
                    <DynamicContactNumber
                      numbers={this.state.numbers}
                      setNumber={this.setNumber}
                    />
                    <hr />
                    <DynamicWhatsApp
                      numbers={this.state.whatsApp}
                      setWhatsApp={this.setWhatsApp}
                    />
                    <hr />
                    <DynamicInstagram
                      instagrams={this.state.instagrams}
                      setInstagram={this.setInstagram}
                    />
                    <hr />
                    <DynamicFacebook
                      facebook={this.state.facebook}
                      setFacebook={this.setFacebook}
                    />
                    <hr />
                    <DynamicLinkedIn
                      linkedIn={this.state.linkedIn}
                      setLinkedIn={this.setLinkedIn}
                    />
                    <hr />
                    <DynamicTelegram
                      telegram={this.state.telegram}
                      setTelegram={this.setTelegram}
                    />
                    <hr />
                    <DynamicTwitter
                      twitter={this.state.twitter}
                      setTwitter={this.setTwitter}
                    />
                    <hr />
                    <DynamicYouTube
                      youtube={this.state.youtube}
                      setYouTube={this.setYouTube}
                    />
                    <hr />
                    <DynamicSnapChat
                      snapchat={this.state.snapchat}
                      setSnapChat={this.setSnapChat}
                    />
                    <hr />
                    <AdditionalUrl
                      url={this.state.url}
                      setAdditionalUrl={this.setAdditionalUrl}
                    />
                    <hr />

                    <Button
                      type="submit"
                      className="btn-primary"
                      name="submit"
                      id="submit"
                      text="submit"
                    />

                    <div id="info"></div>
                  </form>
                </>
              )}
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
