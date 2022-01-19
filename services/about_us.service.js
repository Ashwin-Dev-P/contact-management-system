//Models
const mongoose = require("mongoose");
const AboutUsModel = mongoose.model("AboutUsSingletonData");

//repositories
const aboutUsRepository = require("../repositories/aboutUs.repository");

//utils
const isValidUrl = require("../utils/validUrl");

const getAboutUS = async () => {
  const select = "-_id persons";
  var about_us = await aboutUsRepository.getAboutUs(select);
  if (about_us === null) {
    about_us = [];
  }

  const result = {
    data: about_us.persons,
    status: 200,
  };

  return result;
};

//Check validity in post
async function validPerson(person, person_index) {
  const { name, picture, about, urls } = person;
  var result;

  //name validation
  if (!name || name.trim().length < 1) {
    result = {
      message: `Please enter a valid name for person${person_index + 1}`,
      status: 400,
    };
    return result;
  }

  //picture url validation
  if (picture && picture.trim().length > 0 && !(await isValidUrl(picture))) {
    result = {
      message: `Please enter a valid picture url for person${person_index + 1}`,
      status: 400,
    };
    return result;
  }

  //links
  if (urls) {
    for (var i = 0; i < urls.length; i++) {
      var url_object = urls[i];
      var url_object_name = url_object.name;
      var url_object_url = url_object.url;

      if (url_object) {
        if (
          url_object_name.trim().length < 1 ||
          url_object_url.trim().length < 1
        ) {
          result = {
            message: `Please enter a valid url in pair ${i + 1} for person${
              person_index + 1
            }`,
            status: 400,
          };
          return result;
        }
      }
    }
  }

  result = {
    status: 200,
  };

  return result;
}

async function aboutUsInputValidation(persons) {
  var validity_response;
  //validation
  if (!persons) {
    validity_response = {
      message: "Please enter valid about us details",
      status: 400,
    };

    return validity_response;
  } else {
    for (var i = 0; i < persons.length; i++) {
      var valid = await validPerson(persons[i], i);
      if (valid.status !== 200) {
        validity_response = {
          message: valid.message,
          status: 400,
        };

        return validity_response;
      }
    }

    validity_response = {
      status: 200,
    };
  }
  return validity_response;
}
const postAboutUs = async (persons, admin) => {
  var response;

  //Check if admin
  if (admin !== true) {
    response = {
      message: "unauthorized access",
      status: 401,
    };
  }

  //check if data already available(if available update aka patch)
  const check_data_availability = await aboutUsRepository.isAboutUsAvailable();
  if (check_data_availability !== null) {
    //update code here

    const filter = {};
    const update = {
      persons: persons,
    };

    //const update = persons;

    const updatedResult = await aboutUsRepository.updateAboutUs(filter, update);

    if (
      updatedResult.acknowledged !== true ||
      updatedResult.modifiedCount !== 1
    ) {
      response = {
        message: "Unable to update",
        status: 500,
      };
      return response;
    } else {
      response = {
        message: "Updated successfully",
        status: 200,
      };
    }

    return response;
  }

  //data validation
  var validity_response = await aboutUsInputValidation(persons);
  if (validity_response.status !== 200) {
    response = validity_response;
    return response;
  }

  var about_us_object = new AboutUsModel();
  about_us_object.persons = persons;

  try {
    about_us_object.save();
  } catch {
    response = {
      message: "Unable to save data",
      status: 500,
    };

    return response;
  }

  response = {
    message: "Data saved successfully",
    status: 200,
  };

  return response;
};

module.exports = {
  getAboutUS,
  postAboutUs,
};
