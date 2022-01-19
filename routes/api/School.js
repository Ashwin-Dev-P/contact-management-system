const express = require('express')
const router = express.Router();
const mongoose = require('mongoose');
const SchoolModel = mongoose.model("School")

//Get all company
router.get('/',async(req,res)=>{
    SchoolModel.find((err,docs)=>{
        if(!err){
            res.setHeader('Content-Type', 'application/json');
            res.json(docs);
        }
        else{

            res.json({ message: "Error collecting documents from collection", status: 500 });
        }
    }).select('name _id').lean();
})


//Search a college
router.post('/search',async(req,res)=>{
    var searchBy = req.body.searchBy;
    var search = req.body.search;
    var count = 5;
    var from = (req.body.page * count)-count;

    if(searchBy !== "schoolName" ){
        return res.json({
            status: 400,
            message: "Enter a valid 'search by' to search",
            data: []
        })
    }
    

    //Check if search is present
    if(search){
        search = search.trim();
        
        
      
        if(search.length < 1){
            return res.json({
                status: 400,
                message: "Enter a value to search",
                data: []
            })
        }
    }else{
        return res.json({
            status: 400,
            message: "Enter a value to search",
            data : []
        })
    }
    
    const filter = {
        name: {
            "$regex": search,

            //For case in-sensitive search
            "$options":'i'
        }

    }

    var select = "name "



    res.setHeader('Content-Type', 'application/json');
    SchoolModel.find(filter,(err,docs)=>{
        if(!err){
            
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({
                
                data: docs,
                status: 200
            });
        }
        else{

            res.status(500).json({ message: "Error", status:"500" });
        }
    }).skip(from).limit(count).select(select).lean();
})

module.exports = router;