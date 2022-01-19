const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const ClientDetailsModel = mongoose.model("ClientDetails");
//const requestIp = require('request-ip');

//Get all members
router.get("/", async (req, res) => {
  ClientDetailsModel.find((err, docs) => {
    if (!err) {
      res.setHeader("Content-Type", "application/json");
      return res.status(200).json(docs);
    } else {
      return res
        .status(500)
        .json({
          message: "Error collecting documents from collection",
          status: 500,
        });
    }
  })
    .select("-__v -updatedAt")
    .lean();
});

//Get ip
router.get("/get_ip", async (req, res) => {
  //This is a 3rd party module function, not an inbuilt.Remove the package as well
  //const clientIp = requestIp.getClientIp(req);

  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const ip2 = req.ip;

  //NavigatorUserAgent
  const browserUserAgent = req.headers["user-agent"];
  const language = req.headers["accept-language"];

  res.header("Content-Type", "application/json");
  return res.status(200).json({
    ip,
    ip2,
    browserUserAgent,
    language,
  });
});

//Post a ip
router.post("/", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const navigatorUserAgent = req.headers["user-agent"];

  const osName = req.body.osName;
  const osVersion = req.body.osVersion;
  const browserName = req.body.browserName;
  const browserVersion = req.body.browserVersion;

  const navigatorVendor = req.body.navigatorVendor;

  ClientDetailsModel.exists(
    {
      ipAddress: ipAddress,
      osName,
      osVersion,
      browserName,
      browserVersion,
      navigatorUserAgent,
      navigatorVendor,
    },
    (err, docs) => {
      if (!err) {
        if (docs === null) {
          var details = new ClientDetailsModel();
          details.ipAddress = ipAddress;
          details.osName = osName;
          details.osVersion = osVersion;
          details.browserName = browserName;
          details.browserVersion = browserVersion;
          details.navigatorUserAgent = navigatorUserAgent;
          details.navigatorVendor = navigatorVendor;

          details.save((err, doc) => {
            if (err) {
              console.log(err);
              return res.status(200).json({
                message: "error",
                err,
                status: 500,
              });
            } else {
              return res.status(200).json({
                status: 200,
              });
            }
          });
        } else {
          return res.status(200).json({
            message: "Details already present",

            status: 200,
          });
        }
      } else {
        console.log("exists error");
        console.log(err);
        return res.status(200).json({
          message: "error",
          err,
          status: 500,
        });
      }
    }
  );
});

module.exports = router;
