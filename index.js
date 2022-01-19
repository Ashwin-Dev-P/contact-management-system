const express = require('express');
const app = express();

var compression = require('compression');
app.use(compression());

//Block ips
app.use("*", async function(req,res,next,){
    var blackList = require('./blackList.json')
    var ipAddress = req.headers['x-forwarded-for'] ||  req.socket.remoteAddress ||  req.remoteAddress ||req.ip  ;

    if(blackList.indexOf(ipAddress) > -1)
    {
        return res.send("Please disable your proxy server or VPN or Tor network");
    }
    next();
})


const path = require('path');

//To enable .env file
require('dotenv').config()

//Cookie
const cookieParser = require('cookie-parser');
app.use(cookieParser());

//body parser deprecation replacement
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));


//Enable CORS
const cors = require('cors')
if(process.env.NODE_ENV === 'production'  ){
    var corsOptions = {
        origin: ['https://cms-mern.herokuapp.com/' ],
        optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
        credentials: true,
    }
}
else{
    var corsOptions = {
        origin: ['http://localhost:3000','https://www.instagram.com/'],
        optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
        credentials: true,
    }
}

app.use(cors(corsOptions))

//DB connection
const connection = require("./model");

const PORT = process.env.PORT || 5000;


//Request logs middleware
//const logs = require("./middleware/RequestLogs.middleware");
//app.use(logs);

//Redirect http to https protocol
if(process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
      if (req.header('x-forwarded-proto') !== 'https')
        res.redirect(`https://${req.header('host')}${req.url}`)
      else
        next()
    })
}




//Basic API authentication
const basic_api_authentication = require("./middleware/Authentication.middleware");
//app.use(authentication)

//APIS
const apis = require("./routes/api/index");
app.use(apis);


//Store ip address of the clients(Works on local host but doesnt work on heroku, doesnt cause error though)
/*
const mongoose = require('mongoose');
const ClientIPModel = mongoose.model("ClientIP");
app.use('*',async function(req,res,next){
    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    await ClientIPModel.exists( {ipAddress: ipAddress },(err,docs)=>{
        if(!err){

            if(docs === null){

                var ip = new ClientIPModel();
                ip.ipAddress = ipAddress;
                ip.additionalIpInfo = req.ip;

                ip.save((err,doc)=>{
                    if(err){
                        console.log(err);

                    }

                })
            }

            next()

        }
        else{

            console.log(err)

        }
    });


    next();

})
*/

//serve static assessts if in production
if(process.env.NODE_ENV === 'production' || true ){
    //Set static folder
    app.use(express.static('client/build'));

    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    });
}


app.listen(PORT, () => {
    console.log(`Server started on  port ${PORT}`);
});


module.exports = app;
