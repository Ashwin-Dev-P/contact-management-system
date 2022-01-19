const express = require('express')
const router = express.Router();
const mongoose = require('mongoose');
const CompanyModel = mongoose.model("Company")

//Get all company
router.get('/',async(req,res)=>{
    CompanyModel.find((err,docs)=>{
        if(!err){
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json(docs);
        }
        else{

            return res.status(500).json({ message: "Error collecting documents from collection", status: 500 });
        }
    }).select('_id name').lean();
})

//Search company
router.post('/search',async(req,res)=>{
    var name = req.body.search;

    var count = 5;
    var from = (req.body.page * count)-count;
    
    if(name && name.length > 0){
        name = name.trim();
        if(name.length < 1){
            return res.json({
                message: "Please enter a company name"
            })
        }
    }
    else{
        return res.json({
            message: "Please enter a company name"
        })
    }
    const filter = {}

    filter.name = {
        "$regex": name,

        //For case in-sensitive search
        "$options":'i'
    }

    CompanyModel.find(filter,(err,docs)=>{
        if(!err){
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({
                data: docs,
                status: 200,
            });
        }
        else{
            console.log(err)
            return res.status(500).json({ message: "Error collecting documents from collection", status: 500 });
        }
    }).skip(from).limit(count).select('_id name').lean();
})

//Post a batch
router.post('/',(req,res)=>{
    var company = new CompanyModel();
    company.name = req.body.name;
    
    res.setHeader('Content-Type', 'application/json');
    company.save((err,doc)=>{
        if(!err){
            return res.status(200).json({ message : "Company registered successfully" ,status: 200  });
        }
        else{
            console.log(err);
            return res.status(500).json({ message : "Unnable to register company" ,status: 500, err: err  });
        }
    })
})

//Delete a company by id
router.delete('/id/:id', async(req, res) => {
    res.setHeader('Content-Type', 'application/json');
    try{
        const result = await CompanyModel.findByIdAndDelete({_id:req.params.id });
        return res.status(200).json({ message : 'Deleted Successfully' , status: 200 });
    }
    catch{
        return res.status(500).json({ message: "Unable to delete company" , status : 500 });
    }
})

module.exports = router;















