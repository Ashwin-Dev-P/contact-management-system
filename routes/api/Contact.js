const express = require("express");
const router = express.Router();

const contact_controller = require("../../controllers/contact.controller");

//Get all contacts
router.get("/limit/:limit/skip/:skip", contact_controller.getAllContacts);

//Post a message
router.post("/", contact_controller.postMessage);

module.exports = router;
