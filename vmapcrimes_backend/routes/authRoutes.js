//importing npm provided libraries
const express = require('express');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

// custom imports
const { makeid } = require('../util')

//initializing some stuff
const router = express.Router();
const user = require('../models/User');
const Role = require('../models/Roles');

// importing npm provided middlewares
const { body, validationResult, param } = require('express-validator');

dotenv.config();

// [ 🟢 UNRESTRICTED ROUTE ]  (May need to later control access with IP based filtering)
// POST to http://localhost:5001/api/v1/admin/adminLogin with { "email":"test@test.com","password" : "test123" }

router.post('/login',
    [
        body('email').notEmpty().withMessage("Email and password cannot be empty").isEmail(),
        body('password').notEmpty().withMessage("Password can not be empty") //check if the email is valid email or not
    ],

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({status:"failure",message:errors});
        }
        var loginuser
        try {
            loginuser = await user.findOne({ email: req.body.email });
            if (!loginuser) {
                return res.status(404).send("Please enter valid Credentials");
            }

            var userRole = await Role.findOne({ _id: loginuser.role });
            var passwordMatches = await bcrypt.compare(req.body.password, loginuser.password)
            if (!passwordMatches) {
                return res.status(404).send("Please enter valid Credentials");
            }


            // After successful username, password verification
            var payload = {
                id: loginuser._id,
                role: userRole._id,
                username: loginuser.name,
            };

            const jwtSessionTok = await jwt.sign(payload, process.env.JWT_SECRET_KEY + loginuser.private_key, { algorithm: 'HS256', expiresIn: 2 * 3600 });
            console.log(jwtSessionTok);
            return res.json({ status: "success", result: { message: "Logged in successfully", auth: jwtSessionTok } })
        } catch (e) {
            console.log(e)
            if (e instanceof mongoose.Error) {
                return res.status(500).json({ status: "failure", message: "Failed to query the database" })
            } else {
                return res.status(500).json({ status: "failure", message: "Some Unknown error occured" })

            }
        }
    }


)

// [ 🔴 NEED ADMIN ACCESS ]


router.get('/logout', async (req, res) => {
    // just a function to revoke the jwt by updating the user's private_key
    res.clearCookie('auth-token')

    let authuser = await user.findOneAndUpdate({ _id: req.auth.id }, { private_key: makeid(7) })
    if (!authuser) {
        return res.status(400).json({ status: "failure", message: "You are not logged in" })
    }
    return res.json({ status: "success", message: "Logged out successfully" })


})
module.exports = router;