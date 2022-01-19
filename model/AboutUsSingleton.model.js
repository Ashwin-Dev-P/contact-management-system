//Singleton

const mongoose = require("mongoose");
//require('mongoose-type-url');

var AboutUsSingletonDataSchema = new mongoose.Schema({
    persons:[
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        picture_url:{
          type: String,
           trim: true,
          //default:,
        },
        about:{
          type: String,
          trim: true,
        },
        links:[
          {
            name:{
              type: String,
              trim: true,
            },
            url:{
              type: String,
              trim: true,
            }
          }
        ],


      }
    ]
}, {
    timestamps: true,
});





mongoose.model("AboutUsSingletonData", AboutUsSingletonDataSchema)
