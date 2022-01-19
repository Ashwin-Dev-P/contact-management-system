//Authentication
module.exports = function authentication(req, res, next) {
  var authheader = req.headers.authorization;

  if (!authheader) {
    res.setHeader("WWW-Authenticate", "Basic");
    return res.json({
      message: "you are not authenticated",
      status: 401,
    });
  }

  var auth = new Buffer.from(authheader.split(" ")[1], "base64")
    .toString()
    .split(":");
  var user = auth[0];
  var pass = auth[1];

  //Keep the password and admin in database
  if (
    user == process.env.BASIC_AUTH_USERNAME &&
    pass == process.env.BASIC_AUTH_PASSWORD
  ) {
    // If Authorized user
    next();
  } else {
    res.setHeader("WWW-Authenticate", "Basic");
    return res.json({
      message: "you are not authenticated",
      status: 401,
    });
  }
};
