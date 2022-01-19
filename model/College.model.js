const mongoose = require("mongoose");


var CollegeSchema = new mongoose.Schema({
    
    name:{
        type: String,
        unique: true,
        required: 'College name is required',
        trim: true,
        index: true,
    },
    college_id:{
        type: String,
        //unique: true,
        trim: true,
    },
    college_type:{
        type: String,
        trim: true,
    },
    departments_available:[{
        department_name:{
            type: String,
            trim: true,
        }
    }],
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





mongoose.model("College",CollegeSchema)