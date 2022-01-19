const express = require('express')
const router = express.Router();
const mongoose = require('mongoose');
const CollegeModel = mongoose.model("College")


//Get all colleges
router.get('/',async(req,res)=>{
    CollegeModel.find((err,docs)=>{
        if(!err){
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json(docs);
        }
        else{

            return res.status(500).json({ message: "Error collecting documents from collection", err:err ,status:500 });
        }
    }).select('_id name').lean();
})





//Post a college
router.post('/',(req,res)=>{
    var college = new CollegeModel();
    college.name = req.body.name;
    college.college_type = req.body.college_type;
    college.contact_details = req.body.contact_details;
    college.college_id = req.body.college_id;
    college.address = req.body.address;
    college.departments_available = req.body.departments_available;
    
    res.setHeader('Content-Type', 'application/json');
    college.save((err,doc)=>{
        if(!err){
            return res.status(200).json({ message : "success" ,status: 200  });
        }
        else{
            console.log(err);
            return res.status(500).json({ message : "error" ,status: 500, err: err  });
        }
    })
})



//Search a college
router.post('/search',async(req,res)=>{
    var searchBy = req.body.searchBy;
    var search = req.body.search;
    var count = 5;
    var from = (req.body.page * count)-count;
    
    if(searchBy !== "collegeName" ){
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
    CollegeModel.find(filter,(err,docs)=>{
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

