
const jwt = require("jsonwebtoken");
module.exports = 
   function SetLoginCookie(res,user_id){
    const JWT_SECRET = process.env.JWT_SECRET;
    
    var JWT_EXPIRES = Number(process.env.JWT_EXPIRES);
    const token = jwt.sign({ id: user_id }, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES });

    
    if (!token){
        return res.status(500).json({
            message: "Couldn't sign the token"
        });
    } 
    
    const options = {
      path: "/",
      expires: new Date(Date.now() + JWT_EXPIRES),
      secure:   process.env.NODE_ENV === "production" ? true : false,
      httpOnly: true ,
      sameSite: process.env.NODE_ENV === "production" ? true : false,
      
    };
    res.status(202).cookie("jwt", token, options);
    
    const options2 = {
      path: "/",
      expires: new Date(Date.now() + JWT_EXPIRES),
      secure:   process.env.NODE_ENV === "production" ? true : false,
      httpOnly: false ,
      sameSite: process.env.NODE_ENV === "production" ? true : false,
      
    };
    res.status(202).cookie("loggedIn", true, options2);
    
    return true
   
   
  };
