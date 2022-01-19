const mongoose = require("mongoose");


var DesignationSchema = new mongoose.Schema({
    
    name:{
        type: String,
        unique: true,
        required: 'Designation name is required',
        trim: true,
        index: true,
    },
    
},{
    timestamps: true,
});





mongoose.model("Designation",DesignationSchema)