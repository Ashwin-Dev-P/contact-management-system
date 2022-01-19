const express = require('express')
const router = express.Router();
const mongoose = require('mongoose');
const SectionModel = mongoose.model("Section")

//Get all sections
router.get('/',async(req,res)=>{
    SectionModel.find((err,docs)=>{
        if(!err){
            res.setHeader('Content-Type', 'application/json');
            res.json(docs);
        }
        else{

            res.json({ message: "Error collecting documents from collection", status:"500" });
        }
    }).select('-__v').lean();
})

//Get all sections within a department
router.get('/department_id/:department_id',async(req,res)=>{

    const department_id =  mongoose.Types.ObjectId(req.params.department_id);
    SectionModel.aggregate([
            { "$match": {  "department_id":department_id  } },
        ],
        function( err, data ) {
        
            if ( err )
            throw err;
        
            //console.log( JSON.stringify( data, undefined, 2 ) );
            res.json(data);
        
        }
    );

    
})



//Post a sections
router.post('/',(req,res)=>{
    var section = new SectionModel();
    section.section_name = req.body.section_name;
    section.department_id = req.body.department_id;
    
    res.setHeader('Content-Type', 'application/json');
    section.save((err,doc)=>{
        if(!err){
            res.json({ message : "success" ,status: "OK"  });
        }
        else{
            console.log(err);
            res.json({ message : "error" ,status: "500", "err": err  });
        }
    })
})

//Delete a section by id
router.delete('/id/:id', async(req, res) => {
    res.setHeader('Content-Type', 'application/json');
    try{
        const result = await SectionModel.findByIdAndDelete({_id:req.params.id });
        res.json({ message : 'Deleted Successfully' , status: 'OK' });
    }
    catch{
        res.json({ message: "error" , status : '500' });
    }
})

module.exports = router;