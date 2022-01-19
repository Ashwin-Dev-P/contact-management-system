var cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');
const MemberModel = mongoose.model("Member")
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = 
    async function jwtLoginAuthentication (req,res,next){
    
    return cookieParser ()(req, res, async function() {
        
        
        if(req.cookies.jwt !== undefined){
            const jwtToken = req.cookies.jwt;
            try{
                var decoded = jwt.verify(jwtToken, JWT_SECRET);
            }
            catch{
                return res.json({
                    message: "Jwt token expired. Please login again",
                    status: 401
                });
            }
            
            const decoded_id = decoded.id;
            var user =  await MemberModel.findOne({ _id: decoded_id  }).select('admin -_id').lean();
            if(user !== undefined && user !== false && user !== null){
                req.user_id = decoded_id;
                req.admin = user.admin;
                return next();
            }
        }

        return res.json({
            message: "Unauthorized",
            status: 401
        });

        
    });
    
   
   
};
