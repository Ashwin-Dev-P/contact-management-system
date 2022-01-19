const axios = require("axios");

module.exports = 
    async function ReCAPTCAHVerification(req,res){

        

        //reCAPTCHA verification
        if(!req.body.reCAPTCHAToken){
            return res.status(200).json({ message: 'reCAPTCHA verification token not found' , status:400  });
        }
        
        const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${req.body.reCAPTCHAToken}`;


        await axios({
            url: verifyUrl,
            method: "get",
        })
        .then(response => {
            
            if(response.data.success !== true || response.data.score < process.env.RECAPTCHA_MINIMUM_SCORE ){
                return res.status(200).json({
                    message: "reCAPTCHA verification failed. Please try again",
                    status: 400,
                    score: response.data.score || response.data.success
                });
            }
            
            
            
            
            
        })
        .catch((err) => {
            console.log(err)
            return res.status(500).json({ message: "reCAPTCHA verification error",err , status: 500 });
        });
        return true
   
   
  };