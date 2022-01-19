const mongoose = require("mongoose");


var ClientDetailsSchema = new mongoose.Schema({
    ipAddress:{
        type: String,
        required: true,
        maxlength: 46,
        trim: true,
        index: true 
    },

    osName:{
        type: String,
        trim: true,
    },
    osVersion:{
        type: String,
        trim: true,
    },
    browserName:{
        type: String,
        trim: true,
    },
    browserVersion:{
        type: String,
        trim: true,
    },
    navigatorUserAgent:{
        type: String,
        trim: true,
    },
    navigatorVendor:{
        type: String,
        trim: true,
    },
    
    visits:[
        {
            type: Date,
            default: Date.now,
        }
    ]
},{
    timestamps: true,
});





mongoose.model("ClientDetails",ClientDetailsSchema)