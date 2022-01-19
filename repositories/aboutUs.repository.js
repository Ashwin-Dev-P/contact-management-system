//Modules
const mongoose = require("mongoose");

//Models
const AboutUsModel = mongoose.model("AboutUsSingletonData");

const getAboutUs = async (select) => {
  const about_us = AboutUsModel.findOne().select(select).lean();
  return about_us;
};

const isAboutUsAvailable = async () => {
  const is_available = AboutUsModel.findOne().select("_id").lean();
  return is_available;
};

const updateAboutUs = async (filter, update) => {
  //const result = await AboutUsModel.findOneAndUpdate(filter, update);
  const result = await AboutUsModel.updateOne(filter, update);

  return result;
};

module.exports = {
  getAboutUs,
  isAboutUsAvailable,
  updateAboutUs,
};
