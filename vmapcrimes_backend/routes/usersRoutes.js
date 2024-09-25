//importing npm provided libraries
const express = require('express');
const bcrypt =  require('bcrypt');
const dotenv= require('dotenv');
const mongoose = require("mongoose");

// custom imports
const config = require('../config/defaultConfig')
const {makeid } = require("../util")
//initializing some stuff
const router = express.Router();
const user= require('../models/User');
const Role= require('../models/Roles');

// importing npm provided middlewares
const { body, validationResult } = require('express-validator');

// importing custom middlewares
const verifyAccess = require('../middleware/verifyAccess');


dotenv.config();


// POST to http://localhost:5001/api/user/createUser with { "name" : "John Doe",  "email": "test@test.com","password" : "test123", "phone" : "1234567890" , "address" : "dummy address", "role" : "admin2"}

router.post('/createUser',

    // middleware to check if the user has permissions to create new users
    verifyAccess({ACTION_PERMS:["CREATE_USER"]}),
    [

        // check if email is not empty and a valid email address
        body('email').notEmpty().withMessage("Email must not be empty").isEmail().withMessage("Must be a valid email"),

        // check if the name is minimum 5 characters long and maximum 50 characters long
        body('name').notEmpty().withMessage("Name must not be empty").isLength({min: 5}).withMessage("Name must not be smaller than 5 characters").isLength({max : 50}).withMessage("Sorry, name cannot be greater than 50 characters"),

        body('address').notEmpty().withMessage("Address must not be empty").isLength({min: 5}).withMessage("Address must not be smaller than 5 characters").isLength({max : 100}).withMessage("Sorry, address cannot be greater than 100 characters"),

        // check if the phone number is numeric and of length 10
        body('phone').notEmpty().withMessage("Phone number must not be empty").isNumeric().isLength({min: 10,max:10}).withMessage("Phone numbers must be 10 digits in length"),

        // check if the password is not empty and is a strong password : minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1
        body('password').notEmpty().withMessage("Password must not be empty").isStrongPassword().withMessage("Please enter a strong password(With min length of 8,at least one uppercase, one lowercase, one special character and one number "),
        
        body('role').optional().isAlpha().withMessage("Role invalid").isLength({min:5,max:20}).withMessage("Role length must be between 5-20 characters")

    ],async (req, res) => {
        try{

            // check if any of the validations failed
            var errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({errors : errors.array()});
            }

            // check if the email id is unique
            let  email = await user.findOne({email : req.body.email});
        
            if(email) {
                // console.log(email);
                return res.status("400").json({status:"failure",message:"Email must be unique"});

            }

            // check if phone number is unique
            let phone = await user.findOne({phone : req.body.phone});
            
            if(phone) {
                // console.log(email);
                return res.status("400").json({status:"failure",message:"Phone Number must be unique"});
            }
            
            // calculate password hash
            const salt = await bcrypt.genSalt(10);
            const hashedPass = await bcrypt.hash(req.body.password,salt);

            //finally create the user
            let newUser = {
                name : req.body.name,
                email: req.body.email,
                address: req.body.address,
                password: hashedPass,
                phone: req.body.phone,
                private_key: makeid(7)
            }
            let roleName = req.body.role 
            newUser.role = await Role.findOne({name : roleName?roleName:'public'})
            
                await user.create(newUser).then(() => console.log("User successfully created"))
            
            return res.json({status: "success",message:"User successfully added!"});
        } catch(e) {
            console.log("Error  " + e)
            if (e instanceof mongoose.Error) {
                return res.status(500).json({status:"failure",message:"Failed to query the database"})
            }else{
                return res.status(500).json({status:"failure",message:"Some Unknown error occured"})

            }
        }
    }
) 
// END ROUTE 2


// ROUTE 3

// END ROUTE 3

// ROUTE 4
// GET to http://localhost:5001/api/user/fetchAllUsers 

router.get('/fetchAllUsers',verifyAccess({READ_PERMS:["READ_ALL_USERS"]}), async (req,res) => {
        
    try {
        var allUsers = await user.find()
        var toSend = [];
        var i=0;
        for (var item of allUsers) {
                const {_id, name ,role } = item;
                let roleObj = await Role.findOne({_id:role});
                let roleName = roleObj.name;
                toSend[i] = { name: name , role:roleName, id : _id };
                i = i+1; 
                
        }
        return res.json({users: toSend});   
    }catch(e) {
        console.log("Error: "+e)

        if (e instanceof mongoose.Error) {
            return res.status(500).json({status:"failure",message:"Failed to query Database"})

        }else{
            
            return res.status(500).json({status:"failure",message:"Some unknown error occured"})

        }
    }
    
}); 
// END ROUTE 4


// ROUTE 5
// GET to http://localhost:5001/api/user/fetchUser/<userId>

router.get('/fetchUser/:id',verifyAccess({READ_PERMS:['READ_FULL_USER']}),async (req,res) => {
const id = req.params.id;
// console.log(req.params.id+"length is "+req.params.id.length)
var lengthChecks= (id.length==24)
// console.log("length checks "+lengthChecks)
var isAlphanumeric =  /^[a-zA-Z0-9]+$/.test(id)
// console.log("is alpha numeric "+isAlphanumeric)

if (!id || !(typeof id === 'string')|| !lengthChecks || !isAlphanumeric) {
    return res.status(400).json({status:"failure",message : "Please Send a valid id in parameter"})
}

try {
    var requestedUser = await user.findOne({_id:id});
} catch(e) {
    console.log("Error: "+e)

    if (e instanceof mongoose.Error) {
        return res.status(500).json({status:"failure",message:"Failed to query Database"})

    }else{
        
        return res.status(500).json({status:"failure",message:"Some unknown error occured"})

    }
}
if(!requestedUser) { 
    return res.status(404).json({status: "failure",message:"Not Found"})
}
var { _id , name , email , address, phone ,role} = requestedUser;
return res.json({_id: _id,name :name,email:email,address:address,phone:phone,role:role});

}); 
// END ROUTE 5


// ROUTE 6
// DELETE to http://localhost:5001/api/user/deleteUser/<userId>

router.delete('/deleteUser/:id',verifyAccess({ACTION_PERMS:"DELETE_USER"}),async (req,res) => {  
    if (typeof req.params.id !== 'string') {
        return res.status(400).json({status:"failure",message: "Provide a valid ID"});
    }
    var id = req.params.id.toLowerCase();
    if(id === req.auth.id) {
        return res.status(400).json({status:"failure",message:"Unable to delete authenticated user. Please contact an admin"})
    }
    let toDelete;
    try {
        toDelete = await user.findOneAndDelete({_id: id });
        if(!toDelete) {
            return res.status(404).json({status:"failure",message:"User not found"})
        }
    } catch(e) {
        console.log("Error: "+e)

        if (e instanceof mongoose.Error) {
            return res.status(500).json({status:"failure",message:"Failed to query Database"})

        }else{
            
            return res.status(500).json({status:"failure",message:"Some unknown error occured"})

        }
    }
        return res.json({status : "success", message : "User deleted Successfully!"});
    


});
// END ROUTE 6

// ROUTE 7

// END ROUTE 7

// ROUTE 8
// PUT to http://localhost:5001/api/user/updateUser

router.put('/updateUser',verifyAccess({ACTION_PERMS:"UPDATE_USER"}),
[
    body("_id").isAlphanumeric().withMessage("Id should be a string value").isLength({min:24,max:24}).withMessage("Id should be 24 characters in length"),
   // check if email is a valid email address
   body('email').optional().isEmail().withMessage("Must be a valid email"),

   // check if the name is minimum 5 characters long and maximum 50 characters long
   body('name').optional().isLength({min: 5}).withMessage("Name must not be smaller than 5 characters").isLength({max : 50}).withMessage("Sorry, name cannot be greater than 50 characters"),
   
   // check if the address is minimum 5 characters long and maximum 100 characters long
   body('address').optional().isLength({min: 5}).withMessage("Address must not be smaller than 5 characters").isLength({max : 100}).withMessage("Sorry, address cannot be greater than 100 characters"),

   // check if the phone number is numeric and of length 10
   body('phone').optional().isNumeric().isLength({min: 10,max:10}).withMessage("Phone numbers must be 10 digits in length")

]
,async (req,res) => {  
    
    // check if any of the validations failed
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors : errors.array()});
    }
    
    if(typeof req.body._id !== 'string'){
        return res.status(400).json({status:"failure",message:"Please provide a valid id for the user to update"})

    }

    let _id = req.body._id.toLowerCase();
    let toUpdate

    try {
        toUpdate = await user.findOneAndUpdate({_id:_id},req.body)
        if(!toUpdate) {
            return res.status(404).json({status:"failure",message:"User not found"})
        }

    } catch(e) {
        console.log("Error: "+e)

        if (e instanceof mongoose.Error) {
            return res.status(500).json({status:"failure",message:"Failed to query Database"})

        }else{
            
            return res.status(500).json({status:"failure",message:"Some unknown error occured"})

        }
    }
    return res.json({status:"success",message:"User successfully updated"})
})
// END ROUTE 8


// ROUTE 9

// END ROUTE 12

// ROUTE 13
// DELETE to http://localhost:5001/api/user/deleteUsers with a body containing an array of ids to delete

router.delete('/deleteUsers',verifyAccess({ACTION_PERMS:"DELETE_USER"}),async (req,res) => {  
    if(!(Array.isArray(req.body.ids))) {
        return res.status(400).json({status: "failure",message: "Please send ids as array"});
    }
    if(!(req.body.ids.every((item) => {
        return (typeof item === "string" && item.length == 24) 
    }))) {
        return res.status(400).json({status: "failure",message: "Bad Request"})
    }

    let toDelete;
    try {
        toDelete = await user.deleteMany({_id: {$in: id} });
        if(!(toDelete.deletedCount === req.body.ids.length)){
            return res.status(500).json({status:"failure",message:"Something went wrong, All users could not be deleted"})
        }
    } catch(e) {
        console.log("Error: "+e)

        if (e instanceof mongoose.Error) {
            return res.status(500).json({status:"failure",message:"Failed to query Database"})

        }else{
            
            return res.status(500).json({status:"failure",message:"Some unknown error occured"})

        }
    }
        return res.json({status : "success", message : "User deleted Successfully!"});
    


});

// GET to /api/user/fetchUserCount

router.get("/fetchUserCount",verifyAccess({READ_PERMS:"READ_ALL_USERS"}),async (req,res) => 
{
    console.log("In fetch user count")
    try{
        count = await user.countDocuments({})
   } catch(e) {
       console.log("Error: "+e)

       if (e instanceof mongoose.Error) {
           return res.status(500).json({status:"failure",message:"Failed to query Database"})

       }else{
           
           return res.status(500).json({status:"failure",message:"Some unknown error occured"})

       }
   }
   return res.json({count})
   }
)

// GET to /api/users/fetchAuthUser
// res = {name:<username>,id:<userid>,role:<roleid>,roleName:<roleName>,perms:{rperms:[],aperms:[]}}
router.get("/fetchAuthUser",async (req,res) => {
    const uid = req.auth.id;
    const authuser = await user.findOne({_id: uid})
    if(!authuser) {
        return res.status(404).json({status:'failure',message:"User does not exist"})
    }
    const userrole = await Role.findOne({_id:authuser.role})

    if(!userrole) {
        return res.status(404).json({status:'failure',message:"User has been assigned a non-existing role"})
    }
    var {name,email,address,phone,password,} = authuser
    const uname = name
    var {name,_id,read_perms,action_perms} = userrole
    var rolename = name
    var roleid= _id
    const toSend = {
       uid, uname,email,address,phone,roleid,rolename,read_perms,action_perms
    }
    console.log(toSend)
    return res.json(toSend)

})

module.exports = router