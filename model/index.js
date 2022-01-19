const mongoose = require("mongoose");
//var uri = "mongodb+srv://" + process.env.MONGODB_USERNAME  +":"+ process.env.MONGODB_PASSWORD +"@mycluster.gi2hp.mongodb.net/CMS?retryWrites=true&w=majority"

if (
  process.env.USE_MONGODB_ATLAS === "true" ||
  process.env.NODE_ENV === "production"
) {
  //Uses mongodb atlas cloud service
  var uri =
    "mongodb+srv://" +
    process.env.MONGODB_USERNAME +
    ":" +
    process.env.MONGODB_PASSWORD +
    "@mycluster.gi2hp.mongodb.net/CMS?retryWrites=true&w=majority";
} else {
  //Uses mongodb compass localhost storage
  var uri = "mongodb://localhost:27017";
}

mongoose.connect(
  uri,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (error) => {
    if (error) {
      console.log("Error connecting to the database");
      console.log(error);
    }
  }
);

const Member = require("./Member.model.js");
const OrganisationCategory = require("./OrganisationCategory.model.js");
const ClientDetails = require("./ClientDetails.model.js");
const College = require("./College.model.js");
const Batch = require("./Batch.model.js");
const Department = require("./Department.model.js");
const Section = require("./Section.model.js");
const ApplicationSingletonData = require("./ApplicationSingletonData.model.js");
const Company = require("./Company.model");
const Designation = require("./Designation.model");
const School = require("./School.model");
const AboutUsSingletonData = require("./AboutUsSingleton.model.js");
const Contact = require("./Contact.model.js");
/*

3)Department (batch_id is alone enough , remove college id from model)
*/
