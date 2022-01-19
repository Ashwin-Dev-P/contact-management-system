module.exports = function (req, res, next) {
  var details = {
    hostname: req.hostname,
    path: req.path,
    method: req.method,
  };

  next();
};
