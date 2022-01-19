//services
const contactService = require("../services/contact.service");

const getAllContacts = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const { limit, skip } = req.params;
  const result = await contactService.getAllContacts(limit, skip);
  return res.json(result);
};

const postMessage = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const { name, message } = req.body;
  const result = await contactService.postMessage(name, message);
  return res.json(result);
};

module.exports = {
  getAllContacts,
  postMessage,
};
