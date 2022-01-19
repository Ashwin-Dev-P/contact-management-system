const mongoose = require("mongoose");


var CompanySchema = new mongoose.Schema({
    
    name:{
        type: String,
        unique: true,
        required: 'Company name is required',
        trim: true,
        index: true,
    },
    
},{
    timestamps: true,
});





mongoose.model("Company",CompanySchema)