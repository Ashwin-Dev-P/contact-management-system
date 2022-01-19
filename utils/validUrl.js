var validUrl = require("valid-url");

async function isValidUrl(url) {
  if (validUrl.isUri(url)) {
    return true;
  } else {
    return false;
  }
}

module.exports = isValidUrl;
