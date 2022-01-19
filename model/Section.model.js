const mongoose = require("mongoose");


var SectionSchema = new mongoose.Schema({
    section_name:{
        type: String,
        required: true,
    },
    department_id:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Department',
        required: true,
    },
    
});





mongoose.model("Section",SectionSchema)