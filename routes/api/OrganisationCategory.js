const express = require('express')
const router = express.Router();
const mongoose = require('mongoose');
const OrganisationCategoryModel = mongoose.model("OrganisationCategory")


//Get all members
router.get('/',async(req,res)=>{
    OrganisationCategoryModel.find((err,docs)=>{
        if(!err){
            res.setHeader('Content-Type', 'application/json');
            res.json(docs);
        }
        else{

            res.json({ message: "Error collecting documents from collection", status:"500" });
        }
    }).select('-__v').lean();
})

//Post a category
router.post('/',(req,res)=>{
    var category = new OrganisationCategoryModel();
    category.name = req.body.name;
    
    res.setHeader('Content-Type', 'application/json');
    category.save((err,doc)=>{
        if(!err){
            res.json({ message : "success" ,status: "OK"  });
        }
        else{
            console.log(err);
            res.json({ message : "error" ,status: "500", "err": err  });
        }
    })
})

//Delete a memeber by id
router.delete('/id/:id', async(req, res) => {
    res.setHeader('Content-Type', 'application/json');
    try{
        const result = await OrganisationCategoryModel.findByIdAndDelete({_id:req.params.id });
        res.json({ message : 'Deleted Successfully' , status: 'OK' });
    }
    catch{
        res.json({ message: "error" , status : '500' });
    }
})





module.exports = router;