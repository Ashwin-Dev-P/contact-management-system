const about_us_service = require("../services/about_us.service.js");

const about_us_singleton = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const result = await about_us_service.getAboutUS();

  return res.json(result);
};

const post_about_us = async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  const admin = req.admin;

  const persons = req.body.persons;
  const result = await about_us_service.postAboutUs(persons, admin);

  return res.json(result);
};

module.exports = {
  about_us_singleton,
  post_about_us,
};
