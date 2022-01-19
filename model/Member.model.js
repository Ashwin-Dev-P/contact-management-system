const mongoose = require("mongoose");
//require('mongoose-type-url');

var memberSchema = new mongoose.Schema(
  {
    profilePictureUrl: {
      type: String,
      trim: true,
      default: "assets/images/user5.webp",
    },

    signInType: {
      type: String,
      trim: true,
      default: "regular",
    },

    username: {
      type: String,
      //required : "name is required",
      trim: true,

      //Perform function to check if the username is taken
      unique: true,
    },
    first_name: {
      type: String,
      //required : "first name is required",
      trim: true,
    },
    last_name: {
      type: String,
      //required : "last name is required",
      trim: true,
    },
    middle_name: {
      type: String,
      trim: true,
    },

    admin: {
      type: Boolean,
      required: true,
      default: false,
    },

    password: {
      type: String,
      required: true,
      //select: false
    },

    additional_details: {
      height: {
        type: String,
        trim: true,
      },
      age: {
        type: Number,
        trim: true,
      },
    },

    email: [
      {
        type: String,
        lowercase: true,
        index: true,
        unique: true,
        required: true,
        maxlength: 325,
        minlength: 7,
        trim: true,
      },
    ],
    contact_number: [
      {
        number: {
          type: Number,
          //unique: true,
          minlength: 5,
          maxlength: 13,
          trim: true,
          //Doubt
          required: true,
        },
        country_code: {
          type: Number,
          trim: true,
        },
      },
    ],
    address: {
      permanent_address: {
        door_number: {
          type: String,
        },
        street_name: {
          type: String,
        },
        area_name: {
          type: String,
        },

        city: {
          type: String,
        },
        pin_code: {
          type: Number,
        },
        state: {
          type: String,
        },
        country: {
          type: String,
        },
      },
      temporary_address: {
        door_number: {
          type: String,
        },
        street_name: {
          type: String,
        },
        area_name: {
          type: String,
        },

        city: {
          type: String,
        },
        pin_code: {
          type: Number,
        },
        state: {
          type: String,
        },
        country: {
          type: String,
        },
      },
      additional_address: [
        {
          door_number: {
            type: String,
          },
          street_name: {
            type: String,
          },
          area_name: {
            type: String,
          },

          city: {
            type: String,
          },
          pin_code: {
            type: Number,
          },
          state: {
            type: String,
          },
          country: {
            type: String,
          },
        },
      ],
    },
    social_media: {
      twitter_username: [
        {
          type: String,
          //unique: true,
          maxlength: 15,
          minlength: 4,
          trim: true,
        },
      ],
      instagram_username: [
        {
          type: String,
          //unique: true,
          maxlength: 30,
          trim: true,
        },
      ],
      facebook_url: [
        {
          type: String,
          //unique: true,
          trim: true,
        },
      ],
      snapchat_username: [
        {
          type: String,
          //unique: true,
          maxlength: 15,
          minlength: 3,
          trim: true,
        },
      ],
      youtube_channel_url: [
        {
          type: String,
          //unique: true,
          trim: true,
        },
      ],

      telegram: [
        {
          username: {
            type: String,
            minlength: 5,
            //unique: true ,
            trim: true,
          },
          number: {
            number: {
              type: Number,
              //unique: true ,
              minlength: 5,
              maxlength: 13,
              trim: true,
            },
            country_code: {
              type: Number,
              trim: true,
            },
          },
        },
      ],

      whatsapp: [
        {
          number: {
            type: Number,
            //unique: true,
            minlength: 5,
            maxlength: 13,

            //Doubt
            required: true,

            trim: true,
          },
          country_code: {
            type: Number,
          },
        },
      ],
      linkedin_url: [
        {
          type: String,
          //unique: true,
          trim: true,
        },
      ],
      additional_url: [
        {
          urlTitle: {
            type: String,
            required: true,
            trim: true,
          },
          url: {
            type: String,
            //unique: true,
            required: true,
            trim: true,
          },
        },
      ],
    },

    account_type: {
      type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OrganisationCategory",
      },

      college_student_details: {
        register_number: {
          type: Number,
          //unique: true,
          trim: true,
        },
        section_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Section",
        },
        department: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Department",
        },
        batch: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Batch",
        },
        degree: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Degree",
        },
        college_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "College",
        },
      },

      school_student_details: {
        school_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "School",
        },

        //Standard will vary so it cannot be used
      },

      college_staff_details: {
        college: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "College",
        },
        department: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Department",
        },
        subjects_handled: [
          {
            name: {
              type: String,
            },
            code: {
              type: String,
            },
          },
        ],
        work_experience_in_years: {
          type: Number,
        },
      },

      school_staff_details: {
        school: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "School",
        },
        subjects_handled: [
          {
            name: {
              type: String,
            },
          },
        ],
        work_experience_in_years: {
          type: Number,
        },
      },
      company_details: {
        company_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Company",
        },
        designation_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Designation",
        },
      },
    },
    contacts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Member",
      },
    ],
  },
  {
    timestamps: true,
  }
);

mongoose.model("Member", memberSchema);
