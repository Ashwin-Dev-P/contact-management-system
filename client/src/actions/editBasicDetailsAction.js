import { EDIT_BASIC_DETAILS } from "./types";
import axios from "axios";

//Config
import { config } from "../config.js";
const configData = config();
const domain_url = configData.EXPRESS_JS_SERVER_URL;

export const editBasicDetails = (form_data) => (dispatch) => {
  const url = domain_url + "/api/member/basic_details";

  //basic api authentication
  const username = process.env.REACT_APP_BASIC_AUTH_USERNAME;
  const password = process.env.REACT_APP_BASIC_AUTH_PASSWORD;

  const headers = {
    "Content-Type": "application/json",
    auth: {
      username: username,
      password: password,
    },
    withCredentials: true,
    "Content-Type": "multipart/form-data",
  };

  var success;
  var error_message;

  axios
    .patch(url, form_data, headers)
    .then((response) => {
      //Check for axios response status
      if (response.status === 200) {
        //check for server response status
        const status = response.data.status;
        if (status === 200) {
          success = true;
          dispatch({
            type: EDIT_BASIC_DETAILS,
            payload: response.data,
          });
        } else {
          success = false;
          error_message = response.data.message;
        }
      } else {
        success = false;
      }

      if (success === false) {
        const data = {
          message: error_message || "Unable to update details",
          status: 500,
        };
        dispatch({
          type: EDIT_BASIC_DETAILS,
          payload: data,
        });
      }
    })
    .catch((error) => {
      const data = {
        message: "Something went wrong...",
        status: 500,
      };
      dispatch({
        type: EDIT_BASIC_DETAILS,
        payload: data,
      });
    });
};

export default editBasicDetails;
