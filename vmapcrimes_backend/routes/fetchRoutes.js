const express = require('express');
const verifyAccess = require('../middleware/verifyAccess');
const FIR = require("../models/FIR");
const User = require("../models/User")
const Role = require("../models/Roles")
const jwt_decode = require('jwt-decode')
const router = express.Router();
const mongoose = require("mongoose")
require("dotenv").config()

// Returns an array of form [fir_id,lat,lng]
const jwt = require('jsonwebtoken')
const firRbaced = async (roleid, result) => {
    try{

        var userRole, isAdmin;
        if (roleid) {
            
            userRole = await Role.findOne({ _id: roleid })
            isAdmin = userRole.name === "admin"
            // console.log("In firRbaced")
            // console.log(isAdmin)
            // console.log(userRole)
        }
        // console.log("User is : "+userRole.name)
        // visible to user with least privileges
        var toSend = result.map((fir) => {
            return {
                _id: fir._id, coords: fir.Location.coordinates, type: fir.Type_of_incident, highlight: fir.Incident_Highlight,zip:fir.Zip, timestamp: fir.Timestamp_of_Crime, address: fir.Address, crimeCity: fir.Crime_City, penalCode: fir.Penal_code, crimeState: fir.Crime_State,
    
                //visible to user with CRIME_SUSPECTS permission
                ...((roleid && userRole && (isAdmin || userRole.read_perms.includes("CRIME_SUSPECTS"))) ? { suspect: fir.Name_of_accused } : {}),
                ...((roleid && userRole && (isAdmin || userRole.read_perms.includes("CRIME_VICTIM"))) ? { victim: fir.Victim_Name } : {}),
                ...((roleid && userRole && (isAdmin || userRole.read_perms.includes("ACCUSED_VICTIM_RELATION"))) ? { relation: fir.Relation_with_accused } : {}),
                ...((roleid && userRole && (isAdmin || userRole.read_perms.includes("CRIME_USED_WEAPONS"))) ? { weapon: fir.Weapons_Used } : {}),
                ...((roleid && userRole && (isAdmin || userRole.read_perms.includes("CRIME_DETAILS"))) ? { details: fir.Incident_details } : {}),
            }
        })
        // console.log("To Send: " + toSend)
    
        return toSend
    }catch(e) {
        console.log(e)
        return -1

    }
}

router.get('/fetchFIR', async (req, res) => {
    console.log(req.cookies)

    const dateBefore = req.query.dateBefore;
    const dateAfter = req.query.dateAfter;
    const crimeType = req.query.crimeType;
    const zipCode = req.query.zipCode;
    const address = req.query.address;
    const city = req.query.city;
    const state = req.query.state;
    const penalCode = req.query.penalCode;
    const textSearch = req.query.textSearch
    let query = FIR.find({});
    var role, userRole,id
    if (req.cookies) {
        try {

            role = jwt_decode(req.cookies['auth-token']).role
            uid = jwt_decode(req.cookies['auth-token']).id
            const user = await User.findOne({_id:uid})
            const priv_key = user.private_key
            const decoded = jwt.verify(req.cookies['auth-token'],process.env.JWT_SECRET_KEY+priv_key)

            userRole = await Role.findOne({ _id: role })
        } catch (e) {
            console.log(e)
            role=""
        }
    }

    if (dateBefore) {
        query.where('Timestamp_of_Crime').lte(dateBefore);
    }

    if (dateAfter) {
        query.where('Timestamp_of_Crime').gte(dateAfter);
    }

    if (crimeType) {
        query.where('Type_of_incident').equals(crimeType);
    }

    if (zipCode) {
        query.where('Zip').equals(zipCode);
    }

    if (address) {
        query.where({ $text: { $search: address, $path: "Address" } });
    }

    if (penalCode) {
        query.where('Penal_code').equals(penalCode);
    }
    if (state) {
        query.where('Crime_State').equals(state);
    }
    if (city) {
        query.where('Crime_City').equals(city);
    }
    if (role) {

        if (textSearch && ((userRole.name && userRole.name==="admin") ||  (userRole && userRole.read_perms.includes("CRIME_DETAILS")) )) {
            query.where({ $text: { $search: textSearch } }, { matchedFields: { $meta: "textMatchedFields" } });
        }

    }

    query.exec(async (error, result) => {
        // console.log("Result is " + result)
        // console.log("Matched fields are: "+matchedFields)
        if (error) {
            return res.status(500).json({ status: "failure", error: error });
        }

        const toSend = await firRbaced(role, result)
        

        // const {Location,_id} = result;
        // const toSend = [_id,...Location.coordinates]
        if(toSend===-1) {
            return res.status(500).json({status:"failure",message:"Some error occured"})
        }
        return res.json({ status: "success", result: toSend, message: "Fetched FIRs, Success!" })
    });

});


module.exports = router;




