const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const MemberModel = mongoose.model("Member");
const OrganisationCategoryModel = mongoose.model("OrganisationCategory");
const DepartmentModel = mongoose.model("Department");
const CollegeModel = mongoose.model("College");
const BatchModel = mongoose.model("Batch");
const SectionModel = mongoose.model("Section");
//const DesignationModel = mongoose.model('Designation');
const CompanyModel = mongoose.model("Company");
const SchoolModel = mongoose.model("School");

//Functions
const SetLoginCookie = require("../../Functions/SetLoginCookie");
const jwtLoginAuthentication = require("../../Functions/jwtLoginAuthentication");
const getDate = require("../../Functions/GetDate");
const HashPassword = require("../../Functions/HashPassword");
const ReCAPTCHAVerification = require("../../Functions/ReCAPTCHAVerification");

//Hashing password
const bcrypt = require("bcryptjs");
const saltRounds = Number(process.env.SALT_ROUNDS);

const axios = require("axios");
const { verify } = require("jsonwebtoken");

var validUrl = require("valid-url");

//Google sign up
const { OAuth2Client } = require("google-auth-library");
//const { response } = require('express');
const googleClient = new OAuth2Client(process.env.GOOGLE_SIGNUP_CLIENT_ID);

//const auth = require('../../middleware/Auth');

//Get all members
router.get("/", async (req, res) => {
  MemberModel.find((err, docs) => {
    if (!err) {
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(docs);
    } else {
      res
        .status(500)
        .json({
          message: "Error collecting documents from collection",
          status: "500",
        });
    }
  })
    .select("username")
    .lean();
});

//Get all members basic details
router.get("/basic/from/:from/count/:count", async (req, res) => {
  const from = Number(req.params.from) - 1;
  var count = Number(req.params.count);

  res.setHeader("Content-Type", "application/json");
  MemberModel.find((err, docs) => {
    if (!err) {
      res.status(200).json(docs);
    } else {
      res
        .status(500)
        .json({
          message: "Error collecting documents from collection",
          status: "500",
        });
    }
  })
    .skip(from)
    .limit(count)
    .select("_id username profilePictureUrl signInType")
    .lean();
});

//Get a particular member
router.get("/id/:id", async (req, res) => {
  var id = req.params.id;
  MemberModel.findById(id, async function (err, docs) {
    if (err) {
      console.log(err);
      res.status(404).json({ message: "Error", status: "404" });
    } else {
      try {
        //Converting mongodb timestamp to readable format and sendin it in the docs
        const joinedAt = await getDate(docs.createdAt);
        docs.joinedAt = joinedAt;

        const lastUpdatedAt = await getDate(docs.updatedAt);
        docs.lastUpdatedAt = lastUpdatedAt;
      } catch {
        docs.joinedAt = null;
        docs.lastUpdatedAt = null;
      }

      res.status(200).json(docs);
    }
  })
    .select("-__v -password -_id")
    .lean();
});

//Get my profile
router.get("/my_profile", jwtLoginAuthentication, async (req, res) => {
  var id = req.user_id;
  MemberModel.findById(id, async function (err, doc) {
    if (err) {
      console.log(err);
      return res.json({ message: "Error", status: "404" });
    } else {
      return res.status(200).json({
        data: doc,
        status: 200,
      });
    }
  })
    .select(
      "-__v -password -_id -createdAt -updatedAt -contacts -admin -address"
    )
    .lean();
});

//Get my account type
router.get("/account_type", jwtLoginAuthentication, async (req, res) => {
  var id = req.user_id;
  MemberModel.findById(id, async function (err, doc) {
    if (err) {
      console.log(err);
      return res.json({ message: "Error", err: err, status: "404" });
    } else {
      return res.status(200).json({
        data: doc.account_type,
        status: 200,
      });
    }
  })
    .select("-_id account_type ")
    .populate("account_type.type", "name")
    .populate("account_type.college_student_details.college_id", "name")
    .populate(
      "account_type.college_student_details.batch",
      "starting_year pass_out_year"
    )
    .populate(
      "account_type.college_student_details.department",
      "department_name.abbreviation"
    )
    .populate("account_type.college_student_details.section_id", "section_name")

    .populate("account_type.school_student_details.school_id", "name")

    .populate("account_type.company_details.company_id", "name")

    .lean();
});

//Check if the member is a contact
router.get(
  "/already_contact/id/:id",
  jwtLoginAuthentication,
  async (req, res) => {
    var target_id = req.params.id;
    var user_id = req.user_id;
    const exists = await MemberModel.exists({
      _id: user_id,
      contacts: target_id,
    });
    if (exists === true) {
      return res.json({
        message: "Already contact",
        status: 200,
      });
    } else if (exists === false) {
      return res.json({
        message: "Not a contact",
        status: 400,
      });
    } else {
      return res.json({
        message: "Error",
        status: 500,
      });
    }
  }
);

//Get contacts of a particular member
router.get("/contacts", jwtLoginAuthentication, async (req, res) => {
  var user_id = req.user_id;

  //populate the contacts of the user but populate only their usernames and profilePictureUrl
  const data = await MemberModel.findById(user_id)
    .select("contacts -_id")
    .populate("contacts", "username profilePictureUrl signInType")
    .lean();
  if (data) {
    return res.json({
      message: "Success",
      contacts: data.contacts,
      status: 200,
    });
  } else {
    return res.json({
      message: "Error",
      status: 500,
    });
  }
});

//Remove an account from contacts
router.get(
  "/remove_contact/id/:id",
  jwtLoginAuthentication,
  async (req, res) => {
    var user_id = req.user_id;
    var target_id = req.params.id;

    if (user_id == target_id) {
      return res.json({
        message: "Cannot remove yourself from your contacts",
        status: 400,
      });
    }
    var filter = {
      _id: user_id,
      contacts: target_id,
    };

    const data = await MemberModel.findOne(filter)
      .select("contacts -_id")
      .lean();

    if (data && data.contacts) {
      var contactsArray = data.contacts;

      contactsArray = contactsArray.filter((item) => item != target_id);

      const update = {
        contacts: contactsArray,
      };
      const updatedMember = await MemberModel.updateOne(filter, update).lean();
      if (updatedMember.acknowledged === true) {
        return res.json({
          message: "Success",
          status: 200,
        });
      } else {
        return res.json({
          message: "Unable to remove contact",
          status: 500,
        });
      }
    } else {
      return res.json({
        message: "Error",
        status: 500,
      });
    }
  }
);

//Get contact details
router.get("/contact_details", jwtLoginAuthentication, async (req, res) => {
  const id = req.user_id;
  MemberModel.findById(id, async (err, doc) => {
    if (!err) {
      return res.json({
        message: "Contact details fetched successfully",
        data: doc,
        status: 200,
      });
    } else {
      return res.json({
        message: "Error",
        err,
        status: 500,
      });
    }
  })
    .select("-_id email social_media")
    .select("contact_number.country_code contact_number.number ")
    .lean();
});

//Get count
router.get("/count", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  MemberModel.count({}, function (err, count) {
    if (!err) {
      return res.json({
        count,
        status: 200,
      });
    } else {
      return res.json({
        message: "Error calculating count",
        status: 500,
      });
    }
  });
});

//Check if an email exists
router.get("/email_exists/:email", async (req, res) => {
  var email = req.params.email;
  MemberModel.exists({ email: email }, function (err, docs) {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Error", status: 500 });
    } else {
      if (docs === null) {
        doc = {
          status: 404,
          message: "Email does not exist",
        };
        return res.status(404).json(doc);
      } else {
        doc = {
          status: 200,
          message: "Email exists",
        };
        return res.status(200).json(doc);
      }
    }
  });
});

//GEt all members in a particular department
router.get("/department/:department_id", async (req, res) => {
  const department_id = mongoose.Types.ObjectId(req.params.department_id);
  //const section = req.params.section;

  var steps = [
    { $unwind: "$account_type" },
    {
      $match: {
        "account_type.college_student_details.department": department_id,
      },
    },
    /*
        {
          $group: {
              _id: '$answers.answer',
              count: {
                  $sum: 1
              }
            }
          }
        */
  ];

  const my_id = MemberModel.aggregate(
    steps,

    function (err, data) {
      if (err) {
        return res.status(500).json({
          message: "Error aggregating members",
        });
      }

      //console.log( JSON.stringify( data, undefined, 2 ) );

      return res.status(200).json(data);
    }
  );
});

//GEt all members in a particular section
router.get("/section_id/:section_id", async (req, res) => {
  const section_id = mongoose.Types.ObjectId(req.params.section_id);
  const filter = {
    "account_type.college_student_details.section_id": section_id,
  };
  MemberModel.find(filter, async (err, doc) => {
    if (!err) {
      return res.json(doc);
    } else {
      return res.json({
        message: "Error",
        status: 500,
        err,
      });
    }
  })
    .select("username")
    .lean();
});

//GEt catgories
router.get("/category/:name", async (req, res) => {
  const my_id = OrganisationCategoryModel.aggregate(
    [{ $match: { name: req.params.name } }],

    function (err, data) {
      if (err) {
        return res.status(500).json({
          message: "Error collecting data",
        });
      }

      //console.log( JSON.stringify( data, undefined, 2 ) );
      //res.json(data);

      const _id = data[0]._id;

      //Here
      MemberModel.aggregate(
        [
          { $match: { "account_type.type": _id } },

          //{ "$match": { "type": _id } },
        ],

        function (err, data) {
          if (err) {
            return res.status(500).json({
              message: "Error collecting data",
            });
          }

          //console.log( JSON.stringify( data, undefined, 2 ) );

          return res.status(200).json(data);
        }
      );
    }
  );
});

//Get memebers of a particular company
router.get("/company_members/company_id/:company_id", async (req, res) => {
  var company_id = mongoose.Types.ObjectId(req.params.company_id.trim());
  MemberModel.aggregate(
    [
      { $unwind: "$account_type" },

      { $match: { "account_type.company_details.company_id": company_id } },
    ],

    function (err, data) {
      if (!err) {
        data = {
          data: data,
          status: 200,
        };
        return res.status(200).json(data);
      } else {
        data = {
          err: err,
          status: 500,
        };
        return res.status(500).json(data);
      }
    }
  );
});

//Get memebers of a particular company
router.get("/students/school_id/:school_id", async (req, res) => {
  var school_id = mongoose.Types.ObjectId(req.params.school_id.trim());
  MemberModel.aggregate(
    [
      { $unwind: "$account_type" },

      {
        $match: { "account_type.school_student_details.school_id": school_id },
      },
    ],

    function (err, data) {
      if (!err) {
        data = {
          data: data,
          status: 200,
        };
        return res.status(200).json(data);
      } else {
        data = {
          err: err,
          status: 500,
        };
        return res.status(500).json(data);
      }
    }
  );
});

//SEARCH
router.post("/search", async (req, res) => {
  var searchBy = req.body.searchBy;
  var search = req.body.search;
  var count = 5;
  var from = req.body.page * count - count;

  if (searchBy === "username" || searchBy === "email") {
    //Remove spaces between a string
    search = search.replace(/\s/g, "");
  }

  //Check if search is present
  if (search) {
    search = search.trim();

    if (search.length < 1) {
      return res.json({
        status: 400,
        message: "Enter a value to search",
        data: [],
      });
    }
  } else {
    return res.json({
      status: 400,
      message: "Enter a value to search",
      data: [],
    });
  }

  const filter = {};
  var select = "username profilePictureUrl signInType ";

  //Order by
  if (searchBy) {
    if (searchBy === "username") {
      filter.username = {
        $regex: search,

        //For case in-sensitive search
        $options: "i",
      };
    } else if (searchBy === "firstName") {
      filter.first_name = {
        $regex: search,

        //For case in-sensitive search
        $options: "i",
      };
      select = select + "first_name ";
    } else if (searchBy === "lastName") {
      filter.last_name = {
        $regex: search,

        //For case in-sensitive search
        $options: "i",
      };
      select = select + "last_name ";
    } else if (searchBy === "middleName") {
      filter.middle_name = {
        $regex: search,

        //For case in-sensitive search
        $options: "i",
      };
      select = select + "middle_name ";
    } else if (searchBy === "email") {
      filter.email = {
        $regex: search,

        //For case in-sensitive search
        $options: "i",
      };
      select = select + "email ";
    }
  } else {
    return res.json({
      message: "Enter a search by category",
      status: 400,
    });
  }

  MemberModel.find(filter, (err, docs) => {
    if (!err) {
      res.setHeader("Content-Type", "application/json");
      res.status(200).json({
        data: docs,
        status: 200,
      });
    } else {
      res.status(500).json({ message: "Error", status: "500" });
    }
  })
    .skip(from)
    .limit(count)
    .select(select)
    .lean();
});

//Basic member registration
router.post("/basic_registration", async (req, res) => {
  //Data validation function
  function verify(req) {
    //Email validation
    var email = req.body.email;

    var message;

    if (!email) {
      message = "Please enter an email";
      return message;
    }
    email = email.trim();
    const emailRegexp =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    const validEmail = emailRegexp.test(email);

    if (!validEmail) {
      message = "Please enter a valid email";
      return message;
    }

    //Password validation
    var password = req.body.password;
    var passwordConfirmation = req.body.passwordConfirmation;
    if (!password || password.trim().length < 1) {
      message = "Please enter a password";
      return message;
    }

    if (!passwordConfirmation || passwordConfirmation.trim().length < 1) {
      message = "Please enter the password confirmation";
      return message;
    }

    if (password !== passwordConfirmation) {
      message = "Both the passwords do not match";
      return message;
    }

    //First name
    var first_name = req.body.firstName;
    if (!first_name || first_name.trim().length < 1) {
      message = "Please enter your first name";
      return message;
    } else {
      first_name = first_name.trim();
      validName = !/[^a-z]/i.test(first_name);
      if (!validName) {
        message =
          "Please enter a valid first name. First name should only contain alphabets";
        return message;
      }
    }

    //middle name
    var middleName = req.body.middleName;
    if (!middleName || middleName.trim().length < 1) {
      req.body.middleName = "";
    } else {
      validName = !/[^a-z]/i.test(middleName.trim());
      if (!validName) {
        message =
          "Please enter a valid first name. Middle name should only contain alphabets";
        return message;
      }
    }

    //Last name
    const last_name = req.body.lastName;
    if (!last_name || last_name.trim().length < 1) {
      message = "Please enter your last name";
      return message;
    } else {
      validName = !/[^a-z]/i.test(last_name.trim());
      if (!validName) {
        message =
          "Please enter a valid last name. Last name should only contain alphabets";
        return message;
      }
    }

    //username
    const username = req.body.username;
    if (!username || username.trim().length < 1) {
      message = "Please enter a username";
      return message;
    }

    return true;
  }

  //ReCaptcha verification(This is the first step since we proceed to use our resources only when we are sure that the user is a human)
  ReCAPTCHAVerification(req, res);

  //Verify data (function call)
  var validData = verify(req);

  if (validData === true) {
    const username = req.body.username.trim();
    const first_name = req.body.firstName.trim();
    const last_name = req.body.lastName.trim();
    const middle_name = req.body.middleName.trim();
    var password = req.body.password.trim();
    const password_confirmation = req.body.passwordConfirmation.trim();
    const email = req.body.email.trim();

    //Check if mail id is already present
    const mailAlreadyInUse = await MemberModel.exists({ email: email }).then(
      async (doc) => {
        return doc;
      }
    );
    if (mailAlreadyInUse === true) {
      return res.json({
        message: "E-mail id " + email + " is already in use",
        status: 400,
      });
    }

    //Check if username is already present
    const usernameAlreadyInUse = await MemberModel.exists({
      username: username,
    }).then(async (doc) => {
      return doc;
    });
    if (usernameAlreadyInUse === true) {
      return res.json({
        message: "Username " + username + " is already in use",
        status: 400,
      });
    }

    //Hash the password
    password = await HashPassword(password);

    //Create and save model
    member = new MemberModel();
    member.username = username;
    member.first_name = first_name;
    member.last_name = last_name;
    member.middle_name = middle_name;
    member.password = password;
    member.password_confirmation = password_confirmation;
    member.email = email;

    await member.save((err, doc) => {
      if (!err) {
        SetLoginCookie(res, doc._id);

        var details = {
          email: doc.email,
          _id: doc._id,
          username: doc.username,
        };

        return res
          .status(200)
          .json({
            message: "Registration success",
            status: 200,
            member: details,
          });
      } else {
        return res.json({
          message: "Unable to register",
          status: 500,
          err: err,
        });
      }
    });
  } else {
    return res.json({
      message: validData,
      status: 400,
    });
  }
});

//Google sign up
router.post("/register/google", async (req, res) => {
  const { idToken } = req.body;

  res.setHeader("Content-Type", "application/json");
  googleClient
    .verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_SIGNUP_CLIENT_ID,
    })
    .then(async (response) => {
      const { email_verified, email, picture, given_name, family_name } =
        response.payload;

      if (email_verified !== true) {
        return res.json({
          message: "Your email is not verified. Please try signing up again",
          status: 400,
        });
      }

      //Check if an account is present already
      const emailAlreadyInUse = await MemberModel.findOne({ email: email })
        .select("_id")
        .lean()
        .then(async (doc) => {
          return doc;
        });

      if (emailAlreadyInUse) {
        SetLoginCookie(res, emailAlreadyInUse._id);
        return res.json({
          message: "Account registered already. Logged in successfully",
          status: 200,
        });
      } else {
        //work here
        var member = new MemberModel();

        member.signInType = "google";
        member.username = req.body.googleId;
        member.first_name = given_name;
        member.last_name = family_name;
        member.profilePictureUrl = picture;
        member.email = [email];

        var password = await HashPassword(
          email + process.env.PASSWORD_HASH_KEY
        );
        member.password = password;

        member.save((err, doc) => {
          if (!err) {
            SetLoginCookie(res, doc._id);

            var details = {
              name: doc.username,
              email: doc.email,
              _id: doc._id,
              profilePicture: doc.profilePicture,
            };

            return res
              .status(200)
              .json({
                message: "Registration success",
                status: 200,
                member: details,
              });
          } else {
            console.log(err);
            return res.json({
              message: "Cannot register user",
              status: 500,
              err: err,
              member: member,
            });
          }
        });
      }
    })
    .catch((error) => {
      return res.json({
        message: "Error signing up",
        error,
        status: 500,
      });
    });
});

//Sign up using facebook
router.post("/register/facebook", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const { userID, accessToken, picture } = req.body;

  if (!userID) {
    return res.json({
      message: "UserID is required to sign up",
      status: 400,
    });
  }

  let urlGraphFacebook = `https://graph.facebook.com/v2.11/${userID}/?fields=id,name,email&access_token=${accessToken}`;

  axios
    .get(urlGraphFacebook)
    .then((response) => {
      const { email, name } = response.data;

      if (!email) {
        return res.json({
          message: "Email is required to sign up",
          status: 400,
        });
      }

      //Check if email alreay exists
      MemberModel.findOne({ email: email }, async (error, doc) => {
        if (!error) {
          //An account with the email exists
          if (doc) {
            SetLoginCookie(res, doc._id);
            return res.json({
              message: "Account already exists. Logged in successfully",
              status: 200,
            });
          }
          //An account doesn't exist , so create a new one
          else {
            var member = new MemberModel();

            member.signInType = "facebook";
            member.username = userID;
            member.first_name = name;

            member.profilePictureUrl = picture;
            member.email = [email];

            var password = await HashPassword(
              email + process.env.PASSWORD_HASH_KEY
            );
            member.password = password;

            member.save((err, doc) => {
              if (!err) {
                SetLoginCookie(res, doc._id);

                var details = {
                  name: doc.username,
                  email: doc.email,
                  _id: doc._id,
                  profilePictureUrl: doc.profilePictureUrl,
                };

                return res
                  .status(200)
                  .json({
                    message: "Registration success",
                    status: 200,
                    member: details,
                  });
              } else {
                console.log(err);
                return res.json({
                  message: "Cannot register user",
                  status: 500,
                  err: err,
                  member: member,
                });
              }
            });
          }
        } else {
          console.log(error);
          return res.json({
            message: "Something went wrong",
            status: 500,
            error,
          });
        }
      })
        .select("_id")
        .lean();
    })
    .catch((error) => {
      console.log(error);
      return res.json({
        message: "Something went wrong",
        status: 500,
        error,
      });
    });
});

//Post a member real time application
router.post("/", async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  //ReCaptcha verification(This is the first step since we proceed to use our resources only when we are sure that the user is a human)
  ReCAPTCHAVerification(req, res);

  //Save member funcion
  function saveMember(member) {
    member.save((err, doc) => {
      if (!err) {
        SetLoginCookie(res, doc._id);

        var details = {
          name: doc.name,
          email: doc.email,
          _id: doc._id,
        };

        return res
          .status(200)
          .json({
            message: "Registration success",
            status: 200,
            member: details,
          });
      } else {
        console.log(err);
        if (err.code === 11000 && err.keyPattern.email && err.keyValue.email) {
          const msg = "Email " + err.keyValue.email + " is already in use";
          return res.json({ message: msg, status: 400 });
        } else {
          return res.json({
            message: "Cannot register user",
            status: 500,
            err: err,
            member: member,
          });
        }
      }
    });
  }

  //create and save section
  function createAndSaveSection(req, member, department) {
    var sectionObject = new SectionModel();
    sectionObject.section_name =
      req.body.account_type.college_student_details.section;
    sectionObject.department_id = department._id;

    sectionObject.save((err, doc) => {
      if (!err) {
        member.account_type.college_student_details.section_id = doc._id;
        saveMember(member);
      } else {
        return res
          .status(500)
          .json({
            message: "Some error occured in section registration",
            status: 500,
            err: err,
          });
      }
    });
  }

  //create and save department
  function createAndSaveDepartment(req, member, batch) {
    var department_name =
      req.body.account_type.college_student_details.department_name;

    var departmentObject = new DepartmentModel();
    departmentObject.college_id = batch.college_id;
    departmentObject.batch_id = batch._id;
    departmentObject.department_name.abbreviation = department_name;
    departmentObject.department_name.expansion = "N/A";

    departmentObject.save((err, doc) => {
      if (!err) {
        member.account_type.college_student_details.department = doc._id;
        createAndSaveSection(req, member, doc);
      } else {
        return res
          .status(500)
          .json({ message: "Cannot create department", status: 500, err: err });
      }
    });
  }

  //Create and save batch
  function createAndSaveBatch(req, member, batch) {
    var batchObject = new BatchModel();
    batchObject.starting_year = batch.starting_year;
    batchObject.pass_out_year = batch.pass_out_year;
    batchObject.college_id =
      member.account_type.college_student_details.college_id;
    batchObject.save((err, doc) => {
      if (!err) {
        member.account_type.college_student_details.batch = doc._id;

        createAndSaveDepartment(req, member, doc);
      } else {
        return res
          .status(500)
          .json({
            message: "Cannot create batch",
            status: 500,
            err: err,
            object: batchObject,
          });
      }
    });
  }

  //User input validation
  function validateUserInput(req) {
    //return "Dayummm"

    const username = req.body.username.trim();
    if (username.length < 1) {
      const message = "Please enter your username";
      return message;
    }
    if (!/^[a-zA-Z0-9]+$/.test(username)) {
      const message = "userame must contain only alphabets and numbers";
      return message;
    }
    const password = req.body.password.trim();
    if (!password || password.length < 1) {
      const message = "Please enter your pasword";
      return message;
    }
    const password_confirmation = req.body.password_confirmation.trim();
    if (!password_confirmation || password_confirmation.length < 1) {
      const message = "Please confirm your password";
      return message;
    }

    if (password !== password_confirmation) {
      const message = "Both the passwords do not match";
      return message;
    }

    const email_array = req.body.email;
    if (email_array) {
      for (i = 0; i < email_array.length; i++) {
        if (email_array[i].length < 7 || email_array[i].length > 325) {
          const message =
            "Email " +
            email_array[i] +
            " is invalid. Please enter a valid email";
          return message;
        }
      }
    } else {
      const message = "Please enter your email";
      return message;
    }

    const contact_number = req.body.contact_number;
    if (contact_number) {
      for (i = 0; i < contact_number.length; i++) {
        if (
          contact_number[i].number.length < 5 ||
          contact_number[i].number.length > 13
        ) {
          const message = "Please enter a valid contact number";
          return message;
        }
      }
    }

    const social_media = req.body.social_media;
    if (social_media) {
      const instagram_username_array = social_media.instagram_username;

      if (instagram_username_array) {
        for (i = 0; i < instagram_username_array.length; i++) {
          if (
            instagram_username_array[i].length < 1 ||
            instagram_username_array[i].length > 30
          ) {
            const message =
              "Instagram username " +
              instagram_username_array[i] +
              " is an invalid username. Username can have a maximum length of 30";
            return message;
          }
        }
      }
    }

    var account_type = req.body.account_type;
    if (!account_type || !account_type.type) {
      const message = "Please select the type of account";
      return message;
    }

    var college_student_details = req.body.account_type.college_student_details;
    if (college_student_details) {
      var college_name = college_student_details.college_name;
      if (college_name && college_name.length < 1) {
        const message = "Please enter a college name";
        return message;
      }

      var batch = college_student_details.batch;

      if (
        batch &&
        (batch.starting_year < 1900 ||
          batch.pass_out_year < 1900 ||
          batch.starting_year > batch.pass_out_year)
      ) {
        const message = "Please enter a valid batch";
        return message;
      } else if (!batch) {
        const message = "Please enter a batch";
        return message;
      }

      var department_name = college_student_details.department_name;

      if (!department_name || department_name.length < 1) {
        const message = "Please enter a department name";
        return message;
      }

      var section = college_student_details.section;
      if (!section || section.length < 1) {
        const message = "Please enter a section";
        return message;
      }
    }

    var company_details = req.body.account_type.company_details;
    if (company_details) {
      var company_name = company_details.company_name;
      if (!company_name || company_name.length < 1) {
        const message = "Please enter your company name";
        return message;
      }

      var designation_name = company_details.designation_name;
      if (designation_name && designation_name.length < 1) {
        const message = "Please enter your designation name";
        return message;
      }
    }

    return false;
  }

  var message = validateUserInput(req);
  if (message) {
    return res.json({ message: message, status: 400, erh: "lol" });
  } else {
    //Check if username is already present
    const usernameAlreadyInUse = await MemberModel.exists({
      username: req.body.username,
    }).then(async (doc) => {
      return doc;
    });
    if (usernameAlreadyInUse === true) {
      return res.json({
        message: "Username " + username + " is already in use",
        status: 400,
      });
    }

    var member = new MemberModel();

    member.username = req.body.username;

    member.email = req.body.email;

    //For loop to check valid email

    //Password
    var password = req.body.password;

    //Asynchronous salt generation
    const salt = await bcrypt.genSalt(saltRounds);

    //Synchronous hashing
    const hash = bcrypt.hashSync(password, salt);

    member.password = hash;

    member.contact_number = req.body.contact_number;
    member.social_media = req.body.social_media;
    //member.type = req.body.type;
    member.account_type.type = req.body.account_type.type;

    //member.account_type = req.body.account_type;

    if (req.body.account_type.college_student_details) {
      const college_name =
        req.body.account_type.college_student_details.college_name;

      var college_id = CollegeModel.exists(
        { name: college_name },
        function (err, docs) {
          if (err) {
            return res.json({ message: "Error", status: 500, err: err });
          } else {
            //College does not exists so create a college
            if (docs === null) {
              //Create college and all its sub components since it is empty
              var college = new CollegeModel();
              college.name = college_name;
              college.save((err, doc) => {
                if (!err) {
                  member.account_type.type = "6162f640582f9cafa04b4ebe";
                  member.account_type.college_student_details.college_id =
                    doc._id;

                  var batch =
                    req.body.account_type.college_student_details.batch;
                  createAndSaveBatch(req, member, batch);
                } else {
                  return res
                    .status(500)
                    .json({ message: "error", status: 500, err: err });
                }
              });
            } else {
              const college_id = docs._id;

              const batch = req.body.account_type.college_student_details.batch;
              const section =
                req.body.account_type.college_student_details.section;
              const department_name =
                req.body.account_type.college_student_details.department_name;

              member.account_type.college_student_details.college_id =
                college_id;

              BatchModel.exists(
                {
                  college_id: college_id,
                  starting_year: batch.starting_year,
                  pass_out_year: batch.pass_out_year,
                },
                function (err, docs) {
                  if (err) {
                    return res.json({
                      message: "Error",
                      status: 404,
                      err: err,
                    });
                  } else {
                    if (docs === null) {
                      const batch =
                        req.body.account_type.college_student_details.batch;
                      createAndSaveBatch(req, member, batch);
                    } else {
                      var batch = docs._id;
                      member.account_type.college_student_details.batch = batch;

                      DepartmentModel.exists(
                        {
                          college_id: college_id,
                          batch_id: batch,
                          "department_name.abbreviation": department_name,
                        },
                        function (err, docs) {
                          if (err) {
                            console.log(err);
                            return res.json({
                              message: "Error",
                              status: 404,
                              err: err,
                            });
                          } else {
                            if (docs === null) {
                              batch = {
                                _id: member.account_type.college_student_details
                                  .batch,
                                college_id: college_id,
                              };
                              createAndSaveDepartment(req, member, batch);
                            } else {
                              const department_id = docs._id;
                              member.account_type.college_student_details.department =
                                department_id;

                              SectionModel.exists(
                                {
                                  department_id: department_id,
                                  section_name: section,
                                },
                                function (err, docs) {
                                  if (err) {
                                    return res.status(500).json({
                                      message: "error",
                                      err: err,
                                    });
                                  } else {
                                    if (docs === null) {
                                      var department = {
                                        _id: department_id,
                                      };
                                      createAndSaveSection(
                                        req,
                                        member,
                                        department
                                      );
                                    } else {
                                      section_id = docs._id;
                                      member.account_type.college_student_details.section_id =
                                        section_id;

                                      saveMember(member);
                                    }
                                  }
                                }
                              );
                            }
                          }
                        }
                      );
                    }
                  }
                }
              );
            }
          }
        }
      );
    } else if (req.body.account_type.school_student_details) {
      var school_student_details = req.body.account_type.school_student_details;
      var school_name = school_student_details.school_name.trim();
      if (school_name.length < 1) {
        return res.json({
          message: "Please enter your school name",
          status: 400,
        });
      } else {
        SchoolModel.exists({ name: school_name }, function (err, docs) {
          if (!err) {
            if (docs === null) {
              var schoolObject = new SchoolModel();
              schoolObject.name = school_name;
              schoolObject.save((err, doc) => {
                if (!err) {
                  member.account_type.school_student_details.school_id =
                    doc._id;
                  saveMember(member);
                } else {
                  return res.json({
                    message: "Error saving a school object",
                    err: err,
                    status: 500,
                  });
                }
              });
            } else {
              member.account_type.school_student_details.school_id = docs._id;
              saveMember(member);
            }
          } else {
            return res.json({
              message: "Error occured while searching for school name",
              err: err,
              status: 500,
            });
          }
        });
      }
    } else {
      //company account
      if (req.body.account_type.company_details) {
        var company_details = req.body.account_type.company_details;
        CompanyModel.exists(
          { name: company_details.company_name },
          function (err, docs) {
            if (!err) {
              if (docs === null) {
                //create company
                var companyObject = new CompanyModel();
                companyObject.name = company_details.company_name;

                companyObject.save((err, doc) => {
                  if (!err) {
                    member.account_type.company_details.company_id = doc._id;
                    saveMember(member);
                  } else {
                    return res.json({
                      message: "Cannot register your company",
                      status: 500,
                      err: err,
                    });
                  }
                });

                //res.json({ message: "Company not found" , status: 400 , err: err});
              } else {
                const company_id = docs._id;
                member.account_type.company_details.company_id = company_id;
                saveMember(member);
              }
            } else {
              return res.json({
                message: "Error while fetching company details",
                status: 500,
                err: err,
              });
            }
          }
        );
      } else {
        saveMember(member);
      }

      //saveMember(member);
    }
  }
});

//Add to contacts
router.post("/add_contact/id/:id", jwtLoginAuthentication, async (req, res) => {
  //ReCAPTCHAVerification(req,res);
  const user_id = req.user_id;
  var target_id = req.params.id;

  if (user_id == target_id) {
    return res.json({
      message: "Cannot add yourself to your contacts",
      status: 400,
    });
  }

  //Check if already adde to contacts
  const already_present = await MemberModel.exists({
    _id: user_id,
    contacts: target_id,
  }).then(async (doc) => {
    return doc;
  });
  if (already_present === true) {
    return res.json({
      message: "Contact already added",
      status: 400,
    });
  }

  //Add to contacts
  const data = await MemberModel.findOne({ _id: user_id })
    .select("contacts -_id")
    .then(async (response) => {
      const contactsArray = response.contacts;
      contactsArray.push(target_id);
      const filter = { _id: user_id };
      const update = {
        contacts: contactsArray,
      };
      const updatedMember = await MemberModel.updateOne(filter, update).lean();

      if (updatedMember.acknowledged === true) {
        return true;
      }
      return false;
    })
    .catch((err) => {
      return res.json({
        message: "Error",
        err: err,
        status: 500,
      });
    });

  if (data === true) {
    return res.json({
      message: "Added to contacts",

      status: 200,
    });
  } else if (data === false) {
    return res.json({
      message: "Cannot add to contacts",
      status: 500,
    });
  } else {
    return res.json({
      message: "Error",
      status: 500,
    });
  }
});

//Returns college id if already present or creates a new one
async function College(req, member, res) {
  //Update member
  function updateMember(result) {
    const update = {
      "account_type.college_student_details": result,
      "account_type.type": req.body.account_type.type,
      $unset: {
        "account_type.company_details": "",
        "account_type.school_student_details": "",
      },
    };
    MemberModel.findByIdAndUpdate(req.user_id, update, (err) => {
      if (!err) {
        return res.json({
          message: "Account type updated",

          status: 200,
        });
      } else {
        return res.json({
          status: 500,
          err: err,
          message: "Unable to update account type",
        });
      }
    })
      .select("_id")
      .lean();
  }

  //create and save section
  function createAndSaveSection(req, member, department) {
    var sectionObject = new SectionModel();
    sectionObject.section_name =
      req.body.account_type.college_student_details.section;
    sectionObject.department_id = department._id;

    sectionObject.save((err, doc) => {
      if (!err) {
        member.account_type.college_student_details.section_id = doc._id;

        var result = member.account_type.college_student_details;
        updateMember(result);
      } else {
        return res
          .status(500)
          .json({
            message: "Some error occured in section registration",
            status: 500,
            err: err,
          });
      }
    });
  }

  //create and save department
  function createAndSaveDepartment(req, member, batch) {
    var department_name =
      req.body.account_type.college_student_details.department_name;

    var departmentObject = new DepartmentModel();
    departmentObject.college_id = batch.college_id;
    departmentObject.batch_id = batch._id;
    departmentObject.department_name.abbreviation = department_name;
    departmentObject.department_name.expansion = "N/A";

    departmentObject.save((err, doc) => {
      if (!err) {
        member.account_type.college_student_details.department = doc._id;
        createAndSaveSection(req, member, doc);
      } else {
        return res
          .status(500)
          .json({ message: "Cannot create department", status: 500, err: err });
      }
    });
  }

  //Create and save batch
  function createAndSaveBatch(req, member, batch) {
    var batchObject = new BatchModel();
    batchObject.starting_year = batch.starting_year;
    batchObject.pass_out_year = batch.pass_out_year;
    batchObject.college_id =
      member.account_type.college_student_details.college_id;
    batchObject.save((err, doc) => {
      if (!err) {
        member.account_type.college_student_details.batch = doc._id;

        createAndSaveDepartment(req, member, doc);
      } else {
        return res
          .status(500)
          .json({
            message: "Cannot create batch",
            status: 500,
            err: err,
            object: batchObject,
          });
      }
    });
  }

  const college_name =
    req.body.account_type.college_student_details.college_name;

  var college_id = CollegeModel.exists(
    { name: college_name },
    function (err, docs) {
      if (err) {
        return res.json({ message: "Error", status: 500, err: err });
      } else {
        //College does not exists so create a college
        if (docs === null) {
          //Create college and all its sub components since it is empty
          var college = new CollegeModel();
          college.name = college_name;
          college.save((err, doc) => {
            if (!err) {
              member.account_type.type = "6162f640582f9cafa04b4ebe";

              if (!member.account_type.college_student_details) {
                member.account_type.college_student_details = {};
              }
              member.account_type.college_student_details.college_id = doc._id;

              var batch = req.body.account_type.college_student_details.batch;
              createAndSaveBatch(req, member, batch);
            } else {
              return res
                .status(500)
                .json({ message: "error", status: 500, err: err });
            }
          });
        } else {
          const college_id = docs._id;

          const batch = req.body.account_type.college_student_details.batch;
          const section = req.body.account_type.college_student_details.section;
          const department_name =
            req.body.account_type.college_student_details.department_name;

          member.account_type = {};
          member.account_type.college_student_details = {};
          member.account_type.college_student_details.college_id = college_id;

          BatchModel.exists(
            {
              college_id: college_id,
              starting_year: batch.starting_year,
              pass_out_year: batch.pass_out_year,
            },
            function (err, docs) {
              if (err) {
                return res.json({ message: "Error", status: 404, err: err });
              } else {
                if (docs === null) {
                  const batch =
                    req.body.account_type.college_student_details.batch;
                  createAndSaveBatch(req, member, batch);
                } else {
                  var batch = docs._id;
                  member.account_type.college_student_details.batch = batch;

                  DepartmentModel.exists(
                    {
                      college_id: college_id,
                      batch_id: batch,
                      "department_name.abbreviation": department_name,
                    },
                    function (err, docs) {
                      if (err) {
                        console.log(err);
                        return res.json({
                          message: "Error",
                          status: 404,
                          err: err,
                        });
                      } else {
                        if (docs === null) {
                          batch = {
                            _id: member.account_type.college_student_details
                              .batch,
                            college_id: college_id,
                          };
                          createAndSaveDepartment(req, member, batch);
                        } else {
                          const department_id = docs._id;
                          member.account_type.college_student_details.department =
                            department_id;

                          SectionModel.exists(
                            {
                              department_id: department_id,
                              section_name: section,
                            },
                            function (err, docs) {
                              if (err) {
                                return res.status(500).json({
                                  message: "error",
                                  err: err,
                                });
                              } else {
                                if (docs === null) {
                                  var department = {
                                    _id: department_id,
                                  };
                                  createAndSaveSection(req, member, department);
                                } else {
                                  section_id = docs._id;
                                  member.account_type.college_student_details.section_id =
                                    section_id;

                                  var result =
                                    member.account_type.college_student_details;

                                  updateMember(result);
                                }
                              }
                            }
                          );
                        }
                      }
                    }
                  );
                }
              }
            }
          );
        }
      }
    }
  );
}

async function School(req, res, member) {
  //Update member
  function updateMember(result) {
    const update = {
      "account_type.school_student_details":
        result.account_type.school_student_details,
      "account_type.type": req.body.account_type.type,
      $unset: {
        "account_type.company_details": "",
        "account_type.college_student_details": "",
      },
    };
    MemberModel.findByIdAndUpdate(req.user_id, update, (err) => {
      if (!err) {
        return res.json({
          message: "Account type updated",
          status: 200,
        });
      } else {
        return res.json({
          status: 500,
          err: err,
          message: "Unable to update account type",
        });
      }
    })
      .select("_id")
      .lean();
  }

  if (req.body.account_type.school_student_details) {
    var school_student_details = req.body.account_type.school_student_details;
    var school_name = school_student_details.school_name.trim();
    if (school_name.length < 1) {
      return res.json({
        message: "Please enter your school name",
        status: 400,
      });
    } else {
      SchoolModel.exists({ name: school_name }, function (err, docs) {
        if (!err) {
          if (docs === null) {
            var schoolObject = new SchoolModel();
            schoolObject.name = school_name;
            schoolObject.save((err, doc) => {
              if (!err) {
                if (member.account_type.school_student_details === undefined) {
                  member.account_type.school_student_details = {};
                }
                member.account_type.school_student_details.school_id = doc._id;
                updateMember(member);
              } else {
                return res.json({
                  message: "Error saving a school object",
                  err: err,
                  status: 500,
                });
              }
            });
          } else {
            if (member.account_type.school_student_details === undefined) {
              member.account_type.school_student_details = {};
            }
            member.account_type.school_student_details.school_id = docs._id;
            updateMember(member);
          }
        } else {
          return res.json({
            message: "Error occured while searching for school name",
            err: err,
            status: 500,
          });
        }
      });
    }
  }
}

async function Company(req, res, member) {
  //Update member
  function updateMember(result) {
    const update = {
      "account_type.company_details": result.account_type.company_details,
      "account_type.type": req.body.account_type.type,
      $unset: {
        "account_type.school_student_details": "",
        "account_type.college_student_details": "",
      },
    };
    MemberModel.findByIdAndUpdate(req.user_id, update, (err) => {
      if (!err) {
        return res.json({
          message: "Account type updated",
          status: 200,
        });
      } else {
        return res.json({
          status: 500,
          err: err,
          message: "Unable to update account type",
        });
      }
    })
      .select("_id")
      .lean();
  }

  if (req.body.account_type.company_details) {
    var company_details = req.body.account_type.company_details;
    CompanyModel.exists(
      { name: company_details.company_name },
      function (err, docs) {
        if (!err) {
          if (docs === null) {
            //create company
            var companyObject = new CompanyModel();
            companyObject.name = company_details.company_name;

            companyObject.save((err, doc) => {
              if (!err) {
                if (member.account_type.company_details === undefined) {
                  member.account_type.company_details = {};
                }
                member.account_type.company_details.company_id = doc._id;
                updateMember(member);
              } else {
                return res.json({
                  message: "Cannot register your company",
                  status: 500,
                  err: err,
                });
              }
            });

            //res.json({ message: "Company not found" , status: 400 , err: err});
          } else {
            const company_id = docs._id;
            if (member.account_type.company_details === undefined) {
              member.account_type.company_details = {};
            }
            member.account_type.company_details.company_id = company_id;
            updateMember(member);
          }
        } else {
          return res.json({
            message: "Error while fetching company details",
            status: 500,
            err: err,
          });
        }
      }
    );
  }
}

//Patch a member with account type
router.patch("/", jwtLoginAuthentication, async (req, res) => {
  ReCAPTCHAVerification(req, res);
  function validateUserInput(req) {
    const type = req.body.account_type.type;
    var message;
    if (!type) {
      message = "Choose the type of account";
      return message;
    }
    return true;
  }

  const validData = validateUserInput(req);
  if (validData !== true) {
    return res.json({
      message: validData,
      status: 400,
    });
  }
  id = req.user_id;

  var member = await MemberModel.findOne({ _id: id })
    .select("-_id account_type")
    .lean();

  const college_student_details = req.body.account_type.college_student_details;
  const school_student_details = req.body.account_type.school_student_details;
  const company_details = req.body.account_type.company_details;
  if (college_student_details) {
    result = College(req, member, res);
  } else if (school_student_details) {
    result = School(req, res, member);
  } else if (company_details) {
    result = Company(req, res, member);
  } else {
    const update = {
      account_type: req.body.account_type,
      //'account_type.type': req.body.account_type.type
    };

    MemberModel.findByIdAndUpdate(req.user_id, update, (err) => {
      if (!err) {
        return res.json({
          message: "Account type updated",
          status: 200,
        });
      } else {
        console.log(err);
        return res.json({
          status: 500,
          err: err,
          message: "Unable to update account type",
        });
      }
    })
      .select("_id")
      .lean();
  }
});

//Validate contact details
async function validateContactDetails(req) {
  const email_array = req.body.email;
  if (email_array) {
    var emailExists = await MemberModel.exists({
      email: req.body.email,
      _id: { $ne: req.user_id },
    });
    if (emailExists === true) {
      const message = "Email already exists";
      return message;
    }

    var validEmailArray = [];
    for (i = 0; i < email_array.length; i++) {
      //check if email already exists (Note: This step is done first to prevent unecessary request to the database). If it is already present , then continue to next email
      if (validEmailArray.indexOf(email_array[i]) !== -1) {
        continue;
      }

      emailExists = await MemberModel.exists({
        email: email_array[i],
        _id: { $ne: req.user_id },
      });
      if (emailExists === true) {
        const message = "Email " + email_array[i] + " already exists";
        return message;
      }

      if (email_array[i].length < 7 || email_array[i].length > 325) {
        const message =
          "Email " + email_array[i] + " is invalid. Please enter a valid email";
        return message;
      }

      if (validEmailArray.indexOf(email_array[i]) == -1) {
        validEmailArray.push(email_array[i]);
      }
    }
    req.body.email = validEmailArray;
  } else {
    const message = "Please enter your email";
    return message;
  }

  //Contact number validation
  var contact_numbers = req.body.contact_numbers;
  var contactNumbersArray = [];
  for (var i = 0; i < contact_numbers.length; i++) {
    let currentContactNumber = String(contact_numbers[i].number).trim();
    let currentCountryCode = String(contact_numbers[i].country_code).trim();
    if (!(currentContactNumber.length < 1 && currentCountryCode.length < 1)) {
      if (currentCountryCode.length < 1) {
        message = "Please enter the country code " + i;
        return message;
      } else if (currentContactNumber.length < 1) {
        message = "Please enter the number " + i;
        return message;
      } else if (
        currentContactNumber.length > 13 ||
        currentContactNumber.length < 5
      ) {
        message = "Please enter a valid number " + i;
        return message;
      } else {
        //Check for duplicate values
        var targetArray = contactNumbersArray;
        var searchItem = contact_numbers[i];
        var found = false;
        for (var j = 0; j < targetArray.length; j++) {
          if (
            searchItem.number == targetArray[j].number &&
            searchItem.country_code == targetArray[j].country_code
          ) {
            found = true;
            break;
          }
        }

        //If unique value, then push into array
        if (!found) {
          //Convert string values to integers before storing them in database
          contact_numbers[i].number = parseInt(contact_numbers[i].number);
          contact_numbers[i].country_code = parseInt(
            contact_numbers[i].country_code
          );

          targetArray.push(contact_numbers[i]);
        }
      }
    }
  }
  contactNumbersArray = targetArray;

  req.body.contact_number = contactNumbersArray;

  //Whatsapp validation
  contact_numbers = req.body.social_media.whatsapp;
  if (contact_numbers) {
    var contactNumbersArray = [];
    for (var i = 0; i < contact_numbers.length; i++) {
      let currentContactNumber = String(contact_numbers[i].number).trim();
      let currentCountryCode = String(contact_numbers[i].country_code).trim();
      if (!(currentContactNumber.length < 1 && currentCountryCode.length < 1)) {
        if (currentCountryCode.length < 1) {
          message = "Please enter the country code for whatsapp " + i;
          return message;
        } else if (currentContactNumber.length < 1) {
          message = "Please enter the whatsapp number " + i;
          return message;
        } else if (
          currentContactNumber.length > 13 ||
          currentContactNumber.length < 5
        ) {
          message = "Please enter a valid whatsapp number " + i;
          return message;
        } else {
          //Check for duplicate values
          var targetArray = contactNumbersArray;
          var searchItem = contact_numbers[i];
          var found = false;
          for (var j = 0; j < targetArray.length; j++) {
            if (
              searchItem.number == targetArray[j].number &&
              searchItem.country_code == targetArray[j].country_code
            ) {
              found = true;
              break;
            }
          }

          //If unique value, then push into array
          if (!found) {
            //Convert string values to integers before storing them in database
            contact_numbers[i].number = parseInt(contact_numbers[i].number);
            contact_numbers[i].country_code = parseInt(
              contact_numbers[i].country_code
            );

            targetArray.push(contact_numbers[i]);
          }
        }
      }
    }

    contactNumbersArray = targetArray;
    req.body.social_media.whatsapp = contactNumbersArray;
  }

  //Instagram validation
  var instagrams = req.body.social_media.instagram_username;
  if (instagrams) {
    var validInstagrams = [];
    var regex = /^[\w](?!.*?\.{2})[\w.]{1,28}[\w]$/;
    for (var i = 0; i < instagrams.length; i++) {
      var current_instagram = instagrams[i].trim();

      if (current_instagram.length > 0) {
        if (current_instagram.length > 30) {
          info_div.innerHTML =
            "Instagram username " +
            current_instagram +
            " is invalid. Username can have a maximum length of 30 characters only";
          return message;
        }

        if (!regex.test(current_instagram)) {
          message = "Instagram username " + current_instagram + " is invalid";
          return message;
        }

        validInstagrams.indexOf(current_instagram) === -1
          ? validInstagrams.push(current_instagram)
          : null;
      }
    }
    req.body.social_media.instagram_username = validInstagrams;
  }

  //LinkedIn validation
  var linkedIn = req.body.social_media.linkedin_url;
  if (linkedIn) {
    var validLinkedIn = [];
    for (var i = 0; i < linkedIn.length; i++) {
      var current_linkedIn = linkedIn[i];
      if (current_linkedIn.length < 1) {
        continue;
      } else if (validUrl.isUri(current_linkedIn)) {
        validLinkedIn.indexOf(current_linkedIn) === -1
          ? validLinkedIn.push(current_linkedIn)
          : null;
      } else {
        message = "LinkedIn url " + (i + 1) + " is invalid";
        return message;
      }
    }
    req.body.social_media.linkedin_url = validLinkedIn;
  }

  //Telegram validation
  if (req.body.social_media.telegram) {
    var telegrams = req.body.social_media.telegram;
    var message;
    var validTelegram = [];
    for (var i = 0; i < telegrams.length; i++) {
      var current_telegram = telegrams[i];
      if (
        current_telegram === undefined ||
        current_telegram.number.country_code === undefined ||
        current_telegram.number.number === undefined
      ) {
        continue;
      }
      var current_country_code = String(
        current_telegram.number.country_code
      ).trim();
      var current_number = String(current_telegram.number.number).trim();
      var current_telegram_username = current_telegram.username;
      if (
        current_number.length < 1 &&
        current_country_code.length < 1 &&
        current_telegram_username.length < 1
      ) {
        continue;
      }
      //Both the country code and number must be present. Else nothing must be present. Otherwise invalid data
      else if (
        (current_number.length < 1 && !current_country_code.length < 1) ||
        (!current_number.length < 1 && current_country_code.length < 1)
      ) {
        message = "Enter both the telegram country code and number " + (i + 1);
        return message;
      }

      if (
        current_telegram_username > 0 &&
        current_telegram_username.length < 5
      ) {
        message =
          "Enter a valid telegram username " +
          (i + 1) +
          " . Telegram username must be a minimum of 5 characters";
        return message;
      }
      current_telegram.number.country_code = parseInt(
        current_telegram.number.country_code
      );
      current_telegram.number.number = parseInt(current_telegram.number.number);

      //Prevent duplicate values
      var found = false;
      for (var j = 0; j < validTelegram.length; j++) {
        if (
          current_telegram.username &&
          current_telegram.username.length > 0 &&
          validTelegram[j].username &&
          validTelegram[j].username.length > 0 &&
          current_telegram.username == validTelegram[j].username
        ) {
          found = true;
          break;
        } else if (
          current_telegram.number.number &&
          validTelegram[j].number.number &&
          current_telegram.number.country_code &&
          validTelegram[j].number.country_code &&
          validTelegram[j].number.number == current_telegram.number.number &&
          validTelegram[j].number.country_code ==
            current_telegram.number.country_code
        ) {
          found = true;
          break;
        }
      }
      if (!found) {
        validTelegram.push(current_telegram);
      }
    }

    req.body.social_media.telegram = validTelegram;
  }

  //Twitter validation
  var twitter = req.body.social_media.twitter_username;
  if (twitter) {
    function validTwitterHandle(twitterHandle) {
      const twitterHandleRegex = /^@?(\w){1,15}$/;
      return twitterHandleRegex.test(twitterHandle);
    }

    var validTwitter = [];
    for (var i = 0; i < twitter.length; i++) {
      var currentTwitter = twitter[i].trim();
      if (currentTwitter.length < 0) {
        continue;
      } else if (currentTwitter.length < 4 || currentTwitter.length > 15) {
        message = "Twitter username " + currentTwitter + " is invalid";
        return message;
      } else if (validTwitterHandle(currentTwitter)) {
        validTwitter.indexOf(currentTwitter) == -1
          ? validTwitter.push(currentTwitter)
          : null;
      } else {
        message = "Twitter username " + currentTwitter + " is invalid";
        return message;
      }
    }
    req.body.social_media.twitter_username = validTwitter;
  }

  //Function to check an array of valid urls
  function validLinks(data, name) {
    var links = data;
    if (links) {
      var validLinks = [];
      for (var i = 0; i < links.length; i++) {
        const currentLink = links[i];
        var valid = validUrl.isUri(currentLink);
        if (!valid) {
          message = "Enter a valid " + name + " url in input " + (i + 1);
          req.body.error = true;
          return message;
        }

        validLinks.indexOf(currentLink) == -1
          ? validLinks.push(currentLink)
          : null;
        //validLinks.push(currentLink);
      }
      return validLinks;
    }
    return [];
  }

  var facebook = validLinks(req.body.social_media.facebook_url, "facebook");
  if (req.body.error === true) {
    return facebook;
  } else {
    req.body.social_media.facebook_url = facebook;
  }

  var youtube_channel_url = validLinks(
    req.body.social_media.youtube_channel_url,
    "youtube"
  );
  if (req.body.error === true) {
    return youtube;
  } else {
    req.body.social_media.youtube_channel_url = youtube_channel_url;
  }

  function validAdditionalUrl() {
    var url = req.body.social_media.additional_url;

    if (url) {
      const validUrls = [];
      for (var i = 0; i < url.length; i++) {
        var currentUrlName = url[i].urlTitle;
        var currentUrl = url[i].url;

        //Skip the input values which are empty ob both the url and its corresponding name
        if (
          (!currentUrlName && !currentUrl) ||
          (currentUrlName.length < 1 && currentUrl.length < 1)
        ) {
          continue;
        } else if (currentUrlName.length < 1) {
          req.body.error = true;
          message =
            "Please enter a name for the link in the additonal url " + (i + 1);
          return message;
        } else if (currentUrl.length < 1) {
          req.body.error = true;
          message =
            "Please enter a url for the link in the additonal url " + (i + 1);
          return message;
        } else if (!validUrl.isUri(currentUrl)) {
          req.body.error = true;
          message =
            "Please enter a valid url for the link in the additonal url " +
            (i + 1);
          return message;
        } else {
          var found = false;
          for (var j = 0; j < validUrls.length; j++) {
            if (
              currentUrlName == validUrls[j].urlTitle &&
              currentUrl == validUrls[j].url
            ) {
              found = true;
              break;
            } else if (currentUrlName == validUrls[j].urlTitle) {
              req.body.error = true;
              message =
                "Additional link name should be unique. '" +
                currentUrlName +
                "' is already present";
              return message;
            } else if (currentUrl == validUrls[j].url) {
              req.body.error = true;
              message =
                "Additional link should be unique. '" +
                currentUrl +
                "' is already present";
              return message;
            }
          }
          if (!found) {
            validUrls.push(url[i]);
          }
        }
      }
      return validUrls;
    }
    return [];
  }
  var additional_url = validAdditionalUrl();
  if (req.body.error === true) {
    return additional_url;
  } else {
    req.body.social_media.additional_url = additional_url;
  }

  //Snapchat validation
  var snapchat = req.body.social_media.snapchat_username;
  if (snapchat) {
    var validSnapchat = [];
    var regex = /^[a-zA-Z][\w-_.]{1,13}[\w]$/;
    for (var i = 0; i < snapchat.length; i++) {
      var current_snapchat = snapchat[i].trim();

      if (current_snapchat.length > 0) {
        if (current_snapchat.length > 15) {
          message =
            "Invalid snapchat username " +
            (i + 1) +
            ". Username can have a maximum length of 15 characters only";
          return message;
        }

        if (!regex.test(current_snapchat)) {
          message = "Invalid snapchat username " + (i + 1);
          return message;
        }
        validSnapchat.indexOf(current_snapchat) == -1
          ? validSnapchat.push(current_snapchat)
          : null;
      }
    }
    req.body.social_media.snapchat_username = validSnapchat;
  } else {
    req.body.social_media.snapchat_username = [];
  }

  return true;
}

//Get basic details for account editing
router.get("/basic_details", jwtLoginAuthentication, async (req, res) => {
  MemberModel.findById({ _id: req.user_id }, async (err, doc) => {
    if (!err) {
      return res.json({
        data: doc,
        status: 200,
      });
    } else {
      return res.json({
        error: err,
        status: 500,
      });
    }
  }).select(
    "-_id username first_name last_name middle_name profilePictureUrl signInType"
  );
});

//Patch basic details
router.patch("/basic_details", jwtLoginAuthentication, async (req, res) => {
  async function validate() {
    const { username } = req.body;
    var message;
    if (!username || username.trim().length < 1) {
      message = "Please enter an username. Username cannot be empty";
      return message;
    }
    return true;
  }

  var valid = await validate();

  if (valid !== true) {
    return res.json({
      message: valid,
      status: 400,
    });
  } else {
    const { username, first_name, last_name, middle_name } = req.body;
    const filter = {
      _id: req.user_id,
    };
    const update = {
      username: username,
      first_name: first_name,
      last_name: last_name,
      middle_name: middle_name,
    };

    //Check if username already taken
    const usernameExists = await MemberModel.exists({
      username: username,
      _id: { $ne: req.user_id },
    });
    if (usernameExists) {
      return res.json({
        message: "Username already taken",
        status: 400,
      });
    }
    const updatedMember = await MemberModel.updateOne(filter, update).lean();

    if (updatedMember.acknowledged === true) {
      return res.json({
        message: "Details updated",
        status: 200,
      });
    } else {
      return res.json({
        message: "Unable to update details",
        status: 400,
      });
    }
  }
});

//Patch contact details
router.patch("/contact_details", jwtLoginAuthentication, async (req, res) => {
  ReCAPTCHAVerification(req, res);

  const id = req.user_id;
  const message = await validateContactDetails(req);

  if (message === true) {
    const update = {
      email: req.body.email,
      contact_number: req.body.contact_number,
      social_media: {
        whatsapp: req.body.social_media.whatsapp,
        instagram_username: req.body.social_media.instagram_username,
        linkedin_url: req.body.social_media.linkedin_url,
        telegram: req.body.social_media.telegram,
        twitter_username: req.body.social_media.twitter_username,
        facebook_url: req.body.social_media.facebook_url,
        youtube_channel_url: req.body.social_media.youtube_channel_url,
        snapchat_username: req.body.social_media.snapchat_username,
        additional_url: req.body.social_media.additional_url,
      },
    };

    MemberModel.updateOne({ _id: id }, update, async (err) => {
      if (!err) {
        res.json({
          message: "Contact details updated",
          status: 200,
        });
      } else {
        console.log(err);
        res.json({
          err,
          message: "Unable to update contact details",
          status: 500,
        });
      }
    });
  } else if (message !== true) {
    return res.json({
      message: message,
      status: 400,
    });
  }
});

//Delete a memeber by id
router.delete("/", jwtLoginAuthentication, async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  var id = req.user_id;
  try {
    await MemberModel.findByIdAndDelete({ _id: id });
    return res
      .status(200)
      .json({ message: "Deleted Successfully", status: 200 });
  } catch {
    res.status(500).json({ message: "error", status: 500, err: err });
  }
});

module.exports = router;

/*



*/
