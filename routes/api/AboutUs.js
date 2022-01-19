const express = require("express");
const router = express.Router();
const jwtLoginAuthentication = require("../../Functions/jwtLoginAuthentication");

const about_us_controller = require("../../controllers/singletonAboutUs.controller");

router.get("/", about_us_controller.about_us_singleton);

router.post("/", jwtLoginAuthentication, about_us_controller.post_about_us);

module.exports = router;
