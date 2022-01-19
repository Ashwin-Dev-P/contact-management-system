const mongoose = require("mongoose");


var DepartmentSchema = new mongoose.Schema({
    department_name:{
        abbreviation:{
            type: String,
            required: true,
        },
        expansion:{
            type: String,
            required: true,

        }
    },
    department_code:{
        type: String,
    }
    ,
    college_id:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'College',
    },
    batch_id:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Batch',
    },
    sections:[{
        type: String,
    }]
    
},{
    timestamps: true,
});





mongoose.model("Department",DepartmentSchema)