//repository
const contactRepository = require("../repositories/contact.repository");

const getAllContacts = async (limit, skip) => {
  if (!limit) {
    limit = 10;
  }
  const result = await contactRepository.getContacts(limit, skip);
  return result;
};

const postMessage = async (name, message) => {
  var response;
  //Input data validation
  if (!name || name.trim().length < 1) {
    response = {
      message: "Please enter your name",
      status: 400,
    };
  } else if (!message || message.trim().length < 1) {
    response = {
      message: "Please enter a message",
      status: 400,
    };
  }

  //Storing the message data

  try {
    await contactRepository.createMessage(name, message);
  } catch {
    response = {
      message: "Unable to send message",
      status: 500,
    };
    return response;
  }

  response = {
    message: "Message sent",
    status: 200,
  };

  return response;
};

module.exports = {
  getAllContacts,
  postMessage,
};
