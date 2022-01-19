const { response } = require('express');
const express = require('express')
const router = express.Router();
const mongoose = require('mongoose');
const ApplicationSingletonDataModel = mongoose.model("ApplicationSingletonData")
//const loginAuthentication = require("../../middleware/Auth.middleware");
const jwtLoginAuthentication = require("../../Functions/jwtLoginAuthentication")
const validEmail = require('../../Functions/validEmail')

//Patch function
async function patchSingleton(req, res, additional_message) {
    res.setHeader('Content-Type', 'application/json');

    const filter = {};
    const update = {
        'title': req.body.title,
        'contact_us': req.body.contact_us,
        'about_us': req.body.about_us,
        'follow_us': req.body.follow_us
    };

    //Add additional emails without deleting the previous emails
    await ApplicationSingletonDataModel.findOne().select("-_id -createdAt -updatedAt -__v").then(async (doc) => {

        //data from database

        if (doc === null) {
            var emailArray = [];
        } else {
            var emailArray = doc.contact_us.email;
        }
        //user input array
        var inputEmailArray = [];
        var whatsapp = [];
        if (req.body.contact_us) {

            inputEmailArray = req.body.contact_us.email;

            whatsapp = req.body.contact_us.whatsapp;
        }




        inputEmailArray = [];
        for (var i = 0; i < inputEmailArray.length; i++) {
            if (emailArray.filter(email => email === inputEmailArray[i]).length === 0) {

                emailArray.push(inputEmailArray[i]);


            }

        }

        req.body.contact_us = {
            emailArray,
            whatsapp
        };


        try {
            //await ApplicationSingletonDataModel.findOneAndUpdate(filter, update).select('-__v -_id -createdAt -updatedAt').lean();
            await ApplicationSingletonDataModel.updateOne(filter, update).lean();

            if (additional_message !== undefined) {
                return res.status(200).json({ message: 'Patched Successfully', status: 200, additional_message });
            }
            return res.status(200).json({ message: 'Patched Successfully', status: 200 });
        }
        catch (error) {
            return res.status(500).json({ message: "error", status: 500, error: error });
        }



    }).catch((err) => {

        return res.json({
            message: "Error fetching the singleton data count",
            err: err,
            status: 500
        });
    })






}


//Get data
router.get('/:content', async (req, res) => {

    var selectContent = "-_id ";

    const content = req.params.content;
    if (content === 'title') {
        var selectContent = "title -_id";

    }
    else if (content === 'footer') {

        var selectContent = '-createdAt -updatedAt -__v -_id -title';
    }
    else if (content === 'all') {

        var selectContent = ' -createdAt -updatedAt -__v -_id ';
    }
    else {
        return res.status(404).json({
            message: "Please enter a valid parameter"
        });
    }



    try {
        ApplicationSingletonDataModel.findOne((err, docs) => {

            if (!err) {
                if (docs === null) {
                    return res.status(200).json(null);
                }
                res.setHeader('Content-Type', 'application/json');
                return res.status(200).json(docs);
            }
            else {

                return res.status(500).json({ message: "Error collecting documents from collection", status: 500 });
            }

        }).select(selectContent).lean();
    }
    catch (error) {
        return res.status(500).json({ message: "error", status: 500, error });
    }


})

//Post a batch
router.post('/', jwtLoginAuthentication, (req, res) => {

    if (req.admin === false) {
        return res.json({
            message: "Unauthorized access. Admin access required",
            status: 401
        });
    }


    ApplicationSingletonDataModel.count({}, function (err, count) {
        if (!err) {

            if (count === 0) {
                var singleton = new ApplicationSingletonDataModel();

                var about_us = req.body.about_us;

                if (!about_us || about_us.trim().length < 1) {
                    return res.json({ message: "Please enter the about us field", status: 400 })
                }

                const follow_us = req.body.follow_us;
                if (!follow_us) {
                    return res.json({ message: "Please enter the about us field", status: 400 })
                }
                for (var i = 0; i < follow_us.length; i++) {
                    var link_name = follow_us[i].link_name.trim();
                    var link_url = follow_us[i].link_url.trim();
                    if (link_name.length < 1 || link_url.length < 1) {
                        return res.status(400).json({ message: "Please enter a valid link name and url" })
                    }
                }

                const contact_us = req.body.contact_us;
                const email = contact_us.email

                if (email) {
                    for (var i = 0; i < email.length; i++) {
                        var current_email = email[i].trim();
                        if (current_email.length < 1) {
                            return res.status(400).json({ message: "Please enter an email" })
                        }
                        else if (current_email.length < 7 || current_email.length > 325) {
                            const message = "Email " + email_array[i] + " is invalid. Please enter a valid email";
                            return res.status(400).json({ message: message })
                        }
                    }
                }

                singleton.about_us = about_us;
                singleton.follow_us = follow_us;
                singleton.contact_us = contact_us;

                res.setHeader('Content-Type', 'application/json');
                singleton.save((err, doc) => {
                    if (!err) {
                        res.status(200).json({ message: "success", status: 200 });
                    }
                    else {

                        res.json({ message: "error", status: 500, err: err });
                    }
                })
            } else if (count === 1) {
                const additional_message = "Data already exists so its patched"
                patchSingleton(req, res, additional_message);

            }
            else {
                return res.json({ message: "Multiple data  exists already", status: 400 })
            }
        }
        else {
            return res.json({
                message: "Error",
                err: err,
                status: 500
            });
        }

    })




})




//Patch data
router.patch('/', jwtLoginAuthentication, async (req, res) => {
    if (req.admin === false) {
        return res.json({
            message: "Unauthorized access. Admin access required",
            status: 401
        });
    }
    patchSingleton(req, res)
})

router.put('/', jwtLoginAuthentication, async (req, res) => {
    if (req.admin === false) {
        return res.json({
            message: "Unauthorized access. Admin access required",
            status: 401
        });
    }

    const filter = {};
    const update = {
        'title': req.body.title,
        'contact_us': req.body.contact_us,
        'about_us': req.body.about_us,
        'follow_us': req.body.follow_us
    };

    const data = await ApplicationSingletonDataModel.updateOne(filter, update).select("-_id -__v -createdAt -updatedAt").lean();
    if (data.acknowledged === true) {
        return res.json({
            message: "Successfully updated",
            status: 200
        });
    }
    return res.json({
        data: "Error",
        status: 500
    });


});


//Delete data
router.delete('/', jwtLoginAuthentication, async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    if (req.admin === false) {
        return res.json({
            message: "Unauthorized access. Admin access required",
            status: 401
        });
    }

    try {
        await ApplicationSingletonDataModel.deleteMany();
        res.status(200).json({ message: 'Deleted Successfully', status: 200 });
    }
    catch {
        res.status(500).json({ message: "error", status: 500 });
    }
})





module.exports = router;