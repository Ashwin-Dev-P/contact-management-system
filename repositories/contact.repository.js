//modules
const mongoose = require("mongoose");

//Models
const ContactModel = mongoose.model("Contact");

const getContacts = async (limit, skip) => {
  limit = Number(limit);
  skip = Number(skip);
  if (skip < 1) {
    skip = 0;
  }
  const select = "-__v -updatedAt";
  const result = await ContactModel.find()
    .limit(limit)
    .skip(skip)
    .sort({ updatedAt: -1 })
    .select(select)
    .lean();
  return result;
};

const createMessage = async (name, message) => {
  var contact = new ContactModel();
  contact.message = message;
  contact.name = name;
  await contact.save();
};

module.exports = {
  getContacts,
  createMessage,
};
