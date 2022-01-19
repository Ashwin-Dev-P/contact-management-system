const express = require('express')
const router = express.Router();
const mongoose = require('mongoose');
const MemberModel = mongoose.model("Member")

const jwt = require("jsonwebtoken");

const SetLoginCookie = require("../../Functions/SetLoginCookie")

const bcrypt = require('bcryptjs');
const axios = require("axios");

//const axios = require("axios");
const ReCAPTCHAVerification = require('../../Functions/ReCAPTCHAVerification');

var JWT_EXPIRES = Number(process.env.JWT_EXPIRES);

//Google sign in
const {OAuth2Client} = require('google-auth-library');
const  googleClient = new OAuth2Client(process.env.GOOGLE_SIGNUP_CLIENT_ID)

//Functions
const HashPassword = require("../../Functions/HashPassword")


router.post('/login/:type', async (req, res) => {
    ReCAPTCHAVerification(req,res);
    const { email, password } = req.body;
    res.setHeader('Content-Type', 'application/json');
    
    

    // Simple validation
    if (!email || !password) {
      return res.status(200).json({ message: 'Please enter all fields', status:400 });
    }
    
    
  
    try {

      var type = req.params.type;
      // Check for existing user
      if(type === 'admin'){
        var user = await MemberModel.findOne({ email ,admin: true }).select('email  password').lean();
        
      }
      else{
        var user = await MemberModel.findOne({ email  }).select('email  password admin').lean();
        if(!user){
          return res.status(200).json({ message: 'Invalid credentials', status:404 });
        }
        if( user.admin === true ){
          type = 'admin';
        }
      }
      
      
      
      if (!user ){
        return res.status(200).json({ message: 'Invalid credentials' , status: 404 });
      } 

      if(!user.password){
        return res.status(200).json({ message: 'Faulty account' , status: 400 });
      }
  
      

      //Verify password
      const correctPassword = await bcrypt.compare(password, user.password).then((res) => {
        return res;
      });

     
      
      
      delete user.password;
      if(correctPassword !== true){
        return res.json({
          message:"Invalid credentials",
          status:404
        });
      }
      
    
      SetLoginCookie(res,user._id)
      
      if(type === 'admin'){
        const options = {
          path: "/",
          expires: new Date(Date.now() + JWT_EXPIRES),
          secure:   process.env.NODE_ENV === "production" ? true : false,
          httpOnly: false ,
          sameSite: process.env.NODE_ENV === "production" ? true : false,
          
        };
        res.status(202).cookie("admin", true, options);
      }
      
      delete user._id;

      

      return res.status(200).json({
        
        message: "Login success",
        status: 200
        
      });

      
    } catch (e) {
      return res.status(200).json({ message: e.message });
    }
    
  });


//Google login
router.post('/login/login_type/google', async (req, res) => {
  const { idToken } = req.body;


    res.setHeader('Content-Type', 'application/json');
    googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_SIGNUP_CLIENT_ID,
    })
    .then(async(response)=>{
         var { email_verified  , email , picture , given_name, family_name } =  response.payload;
        
        

        if(email_verified !== true){
            return res.json({
                message: "Your email is not verified. Please try logging in again",
                status: 400

            })
        }

        
        //Check if an account is present already
        const emailExists =  await MemberModel.findOne({ email: email } ).select('_id').lean().then( async(doc)=>{
            return doc
        })
      
        if(emailExists){
          
            SetLoginCookie(res,emailExists._id)
            return res.json({
                message: "Logged in successfully",
                status: 200

            })
        }else{

            //Since account hasn't been signed up yet. So account is created
            var member = new MemberModel();

            member.signInType = 'google';
            member.username = req.body.googleId;
            member.first_name = given_name ;
            member.last_name = family_name;
            member.profilePictureUrl = picture;
            member.email = [ email ];


            var password = await HashPassword(email + process.env.PASSWORD_HASH_KEY)
            member.password = password;
            

            member.save((err,doc)=>{
                if(!err){
                    
                   
    
                    SetLoginCookie(res,doc._id);
                    
                    var details = {
                        name: doc.username,
                        email: doc.email,
                        _id: doc._id,
                        profilePicture: doc.profilePicture,
                    }
    
                    return res.status(200).json({ message : "Registration success" ,status: 200 , member: details   });
                }
                else{
                    console.log(err);
                    return res.json({ message : "Cannot register user" ,status: 500, "err": err , member:member });
                    
                    
                }
            })

            
        }

    })
    .catch(error=>{
      console.log(error)
        return res.json({
            message: "Error logging in",
            error,
            status: 500
        })
    })
  
  
});

//Facebook Login
router.post('/login/login_type/facebook', async(req,res)=>{
  res.setHeader('Content-Type', 'application/json');
  const {userID , accessToken , picture } = req.body;

  if(!userID){
      return res.json({
          message: "UserID is required to sign up",
          status: 400,
      })
  }
  
  let urlGraphFacebook = `https://graph.facebook.com/v2.11/${userID}/?fields=id,name,email&access_token=${accessToken}`

  axios.get(urlGraphFacebook)
  .then(response => {
      
      const { email, name} = response.data;

      if(!email){
          return res.json({
              message: "Email is required to login up",
              status: 400,
          })
      }
      
      
      //Check if email alreay exists
      MemberModel.findOne({ email: email}, async(error,doc)=>{
          if(!error){

              //An account with the email exists
              if(doc){
                  SetLoginCookie(res,doc._id);
                  return res.json({
                      message: "Logged in successfully",
                      status: 200,
                  })
              }
              //An account doesn't exist , so create a new one
              else{
                  var member = new MemberModel();

                  member.signInType = 'facebook';
                  member.username = userID;
                  member.first_name = name ;
                  
                  member.profilePictureUrl = picture;
                  member.email = [ email ];

                  var password = await HashPassword(email + process.env.PASSWORD_HASH_KEY)
                  member.password = password;
                  

                  member.save((err,doc)=>{
                      if(!err){
                          
                      
          
                          SetLoginCookie(res,doc._id);
                          
                          var details = {
                              name: doc.username,
                              email: doc.email,
                              _id: doc._id,
                              profilePictureUrl: doc.profilePictureUrl,
                          }
          
                          return res.status(200).json({ message : "Registration success" ,status: 200 , member: details   });
                      }
                      else{
                          console.log(err);
                          return res.json({ message : "Cannot register user" ,status: 500, "err": err , member:member });
                          
                          
                      }
                  })
              }
              

          }else{
              console.log(error)
              return res.json({
                  message: "Something went wrong",
                  status: 500,
                  error
              })
          }
      }).select('_id').lean();

  })
  .catch(error => {
      console.log(error)
      return res.json({
          message: "Something went wrong",
          status: 500,
          error
      })
  })

  
})


router.get('/verify_token', async (req, res) => {
  
  try {
    token_header = req.cookies.jwt;
    // Check for token
    if (!token_header)
      return res.status(200).json({ message: 'No token, authorization denied',status: 401 });

  
    // Verify token
    const JWT_SECRET = process.env.JWT_SECRET;
    const decoded = jwt.verify(token_header, JWT_SECRET);
    
    if(!decoded){
      res.clearCookie("jwt");
      res.clearCookie("loggedIn");
      return res.status(200).json({ message: 'Token is not valid. Please login again.' });
    }
    

    MemberModel.findById( decoded.id, async function (err,doc) {
      if (err){
          
          return res.json({ message: 'Error while fetching user details' , err:err , status: 500 });
      }
      else{
       
          return res.status(200).json({ message: 'Token is  valid' ,doc:doc , status: 200 });
      }
    }).select("username -_id").lean();
    
    
   
    
  } catch (e) {
    return res.status(200).json({ msg: 'Token is not valid' , err: e });
  }
    
});

router.get('/logout', async (req, res) => {
  
  //Clear cookies only if it is present since Mozilla Firefox browser causes warning if cleared cookies whoich are not present already.
  if(req.cookies.jwt){
    res.clearCookie("jwt");
  }else{
    return res.status(200).json({ message: "Logged out already" , status: 200 });
  }

  
  if(req.cookies.loggedIn){
    res.clearCookie("loggedIn");
  }

  if(req.cookies.admin){
    res.clearCookie("admin");
  }
  
  
  
  
  return res.status(200).json({ message: "Logged out successfully" , status: 200 });
});



  
module.exports = router;