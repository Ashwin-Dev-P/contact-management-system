const express = require("express");
const app = express();
const basic_api_authentication = require("../../middleware/Authentication.middleware");

//APIS

//Basic authentication for all API routes
app.use("/api", basic_api_authentication);

//Members API routes
app.use("/api/member", require("./member"));

//Organisation category API routes
app.use("/api/organisation_category", require("./OrganisationCategory"));

//college API routes
app.use("/api/college", require("./College"));

//client ip API routes
app.use("/api/clientDetails", require("./ClientDetails"));

//Batch API routes
app.use("/api/batch", require("./Batch"));

//Department API routes
app.use("/api/department", require("./Department"));

//Section API routes
app.use("/api/section", require("./Section"));

//Company API routes
app.use("/api/company", require("./Company"));

//School API routes
app.use("/api/school", require("./School"));

//auth API routes
app.use("/api/auth", require("./Auth"));

//singleton API routes
app.use("/api/singleton", require("./Singleton"));

//About Us singleton API routes
app.use("/api/about_us_singleton", require("./AboutUs"));

//Contact
app.use("/api/contact", require("./Contact"));

module.exports = app;
