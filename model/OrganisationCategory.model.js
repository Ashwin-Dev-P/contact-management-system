const mongoose = require("mongoose");


var OrganisationCategorySchema = new mongoose.Schema({
    name:{
        type: String,
        unique: true,
        required: true,
    },
});





mongoose.model("OrganisationCategory",OrganisationCategorySchema)