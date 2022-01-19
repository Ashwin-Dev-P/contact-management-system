const mongoose = require("mongoose");


var SchoolSchema = new mongoose.Schema({
    
    name:{
        type: String,
        unique: true,
        required: 'School name is required',
        trim: true,
        index: true,
    },
    school_id:{
        type: String,
        //unique: true,
        trim: true,
    },
   
    address:{
        address:{
            type: String,
            trim: true,
        },
        city:{
            type: String,
            maxlength: 85,
            trim: true,
        },
        state:{
            type: String,
            trim: true,
        },
        country:{
            type: String,
            maxlength: 64,
            trim: true,
        },
        pin_code:{
            type: Number,
            maxlength: 10,
            trim: true,
        },


    },
    contact_details:{
        contact_number:{
            type: String,
            //unique: true,
            trim: true,
        },
        email:{
            type: String,
            lowercase: true,
            //unique: true,
            //required: true,
            maxlength: 325,
            minlength: 7,
            trim: true,
        }
    }
},{
    timestamps: true,
});





mongoose.model("School",SchoolSchema)