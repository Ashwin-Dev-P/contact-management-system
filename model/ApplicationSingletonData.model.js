//Singleton

const mongoose = require("mongoose");
//require('mongoose-type-url');

var ApplicationSingletonDataSchema = new mongoose.Schema({
    title: {
        abbreviation: {
            type: String,

            trim: true,
        },
        expansion: {
            type: String,

            trim: true,
        }

    },
    about_us: {
        type: String,
        required: true,
        trim: true,
    },

    follow_us: [{
        link_name: {
            type: String,
            unique: true,
            trim: true,

        },
        link_url: {
            type: String,
            unique: true,

            trim: true,
        }
    }],

    contact_us: {
        email: [{
            type: String,
            maxlength: 325,
            minlength: 7,
            trim: true,
            unique: true,
        }],
        whatsapp: [{
            number: {
                type: Number,
                //unique: true,
                minlength: 5,
                maxlength: 13,



                trim: true,
            },
            country_code: {
                type: Number,
                trim: true,
            }
        }],
    },






}, {
    timestamps: true,
});





mongoose.model("ApplicationSingletonData", ApplicationSingletonDataSchema)
