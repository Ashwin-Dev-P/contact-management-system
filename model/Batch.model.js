const mongoose = require("mongoose");


var BatchSchema = new mongoose.Schema({
    starting_year:{
        type: Number,
    },
    pass_out_year:{
        type: Number,
        required: true,
    },
    college_id:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'College',
    },
    
});





mongoose.model("Batch",BatchSchema)