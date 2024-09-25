const express = require('express');
const FIR = require("../models/FIR");
const router = express.Router();
const { body, validationResult } = require('express-validator');
const verifyAccess = require('../middleware/verifyAccess');
const mongoose = require('mongoose')

router.post('/uploadFir', verifyAccess({ ACTION_PERMS: ["CREATE_FIR"] }), [

    body('Victim_Name').notEmpty().withMessage("Name is required"),
    
    body('Officers_Name').notEmpty().withMessage("Officer's Name is required"),

    body('Address').notEmpty().withMessage('Address is required'),

    body('Zip').notEmpty().withMessage('Zip is required').isNumeric().withMessage('Zip must be a number').isLength({ min: 6, max: 6 }).withMessage("Provide a valid Zip Code"),

    body('Contact_Number').notEmpty().withMessage('Contact Number is required').isNumeric().withMessage('Contact Number must be a number').isLength({ min: 10, max: 10 }).withMessage("Provide a valid contact number"),

    body('Relation_with_accused').notEmpty().withMessage('Relation with accused is required'),

    body('Name_of_accused').notEmpty().withMessage('Name of accused is required'),

    body('Type_of_incident').notEmpty().withMessage('Type of incident is required'),

    body('Incident_Highlight').notEmpty().withMessage('Incident details is required'),

    body('Incident_details').notEmpty().withMessage('Incident details is required'),

    body('Penal_code').notEmpty().withMessage('Penal code is required').isAlphanumeric().withMessage('Penal code must be a number'),

    body('Crime_City').notEmpty().withMessage('City of crime must not be left empty').isAlpha('en-US', { ignore: ' ' }),

    body('Location.coordinates.*').notEmpty().withMessage('Longitude/Latitude field must not be empty').isNumeric().withMessage('Longitude/Latitude field must be a number'),

    body('Crime_State').notEmpty().withMessage('State of crime must not be left empty').isAlpha('en-US', { ignore: ' ' }),

    body('Timestamp_of_Crime').notEmpty().withMessage("Timestamp of Crime is required").isISO8601().withMessage("Date should be of the format YYYY-MM-DD")


], (req, res) => {
    try {
    console.log("In upload FIR")
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status:"failure",message:errors });
    }
    var { Location } = req.body
    console.log(typeof req.body.Location.coordinates[0])

    req.body.Location.coordinates = [parseFloat(Location.coordinates[0]), parseFloat(Location.coordinates[1])]
    console.log(typeof req.body.Location.coordinates[0])
    const Report = FIR(req.body);
    Report.save();
    res.json({status:"success",message:"FR uploaded successfully"});
} catch (e) {
    console.log("Error occured in fetchFirCount: " + e)

    if (e instanceof mongoose.Error) {
        return res.status(500).json({ status: "failure", message: "Failed to query Database" })

    } else {

        return res.status(500).json({ status: "failure", message: "Some unknown error occured" })

    }
}
});

router.get("/fetchFirCount", async (req, res) => {

    try {
        const firCount =  await FIR.countDocuments({})
        res.status(200).json({count:firCount})
    } catch (e) {
        console.log("Error occured in fetchFirCount: " + e)

        if (e instanceof mongoose.Error) {
            return res.status(500).json({ status: "failure", message: "Failed to query Database" })

        } else {

            return res.status(500).json({ status: "failure", message: "Some unknown error occured" })

        }
    }
})

module.exports = router
