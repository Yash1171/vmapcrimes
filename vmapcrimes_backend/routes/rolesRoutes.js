//importing npm provided libraries
const express = require('express');
const dotenv= require('dotenv');
const mongoose = require("mongoose");


//initializing some stuff
const router = express.Router();
const user= require('../models/User');
const Role= require('../models/Roles');

// importing npm provided middlewares
const { body, validationResult,param } = require('express-validator');

// importing custom middlewares
const verifyAccess = require('../middleware/verifyAccess');



dotenv.config();

// POST to http://localhost:5001/api/v1/admin/addRole with -> { 'role' : 'normaluser', 'read-perms' : [] , 'action-perms' : [] }


router.post('/addRole',
verifyAccess({ACTION_PERMS:["ADD_NEW_ROLE"]}),
    body('role').notEmpty().withMessage("Role name cannot be empty").isLength({min :5, max:20}).withMessage("Role names should be between 5-20 characters in length"),
async (req,res) => {
    try {
        var errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors : errors.array()});
        }
        if (req.body.read_perms && !Array.isArray(req.body.read_perms)) {
            return res.status(400).json({status: 'failure',message:"Read Permissions should be an array of permissions(Strings)"})
        }
        if (req.body.action_perms && !Array.isArray(req.body.action_perms)) {
            return res.status(400).json({status: 'failure',message:"Action Permissions should be an array of permissions(Strings)"})
        }
        var roleExists;
         
            roleExists = await Role.findOne({name: req.body.role});
        
        if(roleExists){
            return res.status(500).json({status:"failure",message:"Cannot create aRolewith that name, Role exists already"})
        }

        await Role.create({
            name: req.body.role,
            read_perms : req.body.read_perms,
            action_perms : req.body.action_perms,
    
        })
        

        return res.json({status:"success",message:"New Role Created"})
    } catch(e) {
        console.log("Error: "+e)

        if (e instanceof mongoose.Error) {
            return res.status(500).json({status:"failure",message:"Failed to query Database"})

        }else{
            
            return res.status(500).json({status:"failure",message:"Some unknown error occured"})

        }
    }

}) 

// DELETE to http://localhost:5001/api/v1/admin/deleteRole/<userId>

router.delete('/deleteRole/:id',verifyAccess({ACTION_PERMS:["DELETE_ROLE"]}),async (req,res) => {  
    if (typeof req.params.id !== 'string') {
        return res.status(400).json({status:"failure",message: "Provide a valid ID"});
    }
    var id = req.params.id.toLowerCase();
    let toDelete;
    try {
        var reqUser = await user.findOne({_id:req.auth.id})
        var reqUserRole = reqUser.role.toString()
        if ( reqUserRole == req.params.id) {
                return res.status(400).json({status:"failure",message:"Cannot delete role, authenticated user has the same role"})
        }
    
        toDelete = await Role.findOneAndDelete({_id: new mongoose.Types.ObjectId(id) });
        if(!toDelete){
            return res.status(404).json({status:"failure",message:"Role not found"})
        }
        await user.deleteMany({role: id}) // to delete all the users having the deleted roles
    } catch(e) {
        console.log("Error: "+e)

        if (e instanceof mongoose.Error) {
            return res.status(500).json({status:"failure",message:"Failed to query Database"})

        }else{
            
            return res.status(500).json({status:"failure",message:"Some unknown error occured"})

        }
    }
        return res.json({status : "success", message : "Role deleted Successfully!"});
    


});

// PUT to http://localhost:5001/api/v1/admin/updateRole

router.put('/updateRole',verifyAccess({ACTION_PERMS:["UPDATE_ROLE"]}), 
[
    body('name').optional().isLength({min:5,max:20}).withMessage("Name of aRolemust be betweem 5-20 characters long"),
    
]
,
async (req,res) => {
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors : errors.array()});
    }
    if (req.body.read_perms && !Array.isArray(req.body.read_perms)) {
        console.log("1")
        return res.status(400).json({status: 'failure',message:"Read Permissions should be an array of permissions(Strings)"})
    }
    console.log("1")

    if (req.body.action_perms && !Array.isArray(req.body.action_perms)) {
        console.log("2")

        return res.status(400).json({status: 'failure',message:"Action Permissions should be an array of permissions(Strings)"})
    }
    try {
        console.log("3")

        let toUpdate = await Role.findOneAndUpdate({name: req.body.name},req.body);
        if(!toUpdate) {
            return res.status(404).json({status:"failure",message:"Role not found"})
        }
    }catch(e) {
        console.log("Error: "+e)

        if (e instanceof mongoose.Error) {
            return res.status(500).json({status:"failure",message:"Failed to query Database"})

        }else{
            
            return res.status(500).json({status:"failure",message:"Some unknown error occured"})

        }
    }

    return res.json({status:"success",message:"User updated Successfully"});
})

// GET to http://localhost:5001/api/v1/admin/fetchRole/<roleID>

router.get('/fetchRole/:id',verifyAccess({READ_PERMS:["READ_FULL_ROLE"]}), 
async (req,res) => {
        // console.log(req.params.id+"length is "+req.params.id.length)
        var lengthChecks= (req.params.id.length==24)
        // console.log("length checks "+lengthChecks)
        var isAlphanumeric =  /^[a-zA-Z0-9]+$/.test(req.auth.id)
        // console.log("is alpha numeric "+isAlphanumeric)

        if (!req.params.id || !(typeof req.params.id === 'string')|| !lengthChecks || !isAlphanumeric) {
            return res.status(400).json({status:"failure",message : "Please Send a valid id in parameter"})
         }

         try {
            let toFetch = await Role.find({_id: req.params.id.toLowerCase()});
            if (!toFetch) {
                return res.status(404).json({status:"failure",message:"Role not found"})
            }
            return res.json(toFetch[0])

         } catch(e) {
            console.log("Error: "+e)
    
            if (e instanceof mongoose.Error) {
                return res.status(500).json({status:"failure",message:"Failed to query Database"})
    
            }else{
                
                return res.status(500).json({status:"failure",message:"Some unknown error occured"})
    
            }
        }

    }
)

// GET to http://localhost:5001/api/v1/admin/fetchAllRoles

router.get('/fetchAllRoles',verifyAccess({READ_PERMS:["READ_ALL_ROLES"]}), async (req,res) => {
    try {
        let fetchArray = await Role.find();
        return res.json({roles:fetchArray})
    }catch(e) {
        console.log("Error: "+e)

        if (e instanceof mongoose.Error) {
            return res.status(500).json({status:"failure",message:"Failed to query Database"})

        }else{
            
            return res.status(500).json({status:"failure",message:"Some unknown error occured"})

        }
    }
})

// DELETE to http://localhost:5001/api/v1/admin/deleteRoles with an array of ids in the body

router.delete('/deleteRoles',
verifyAccess({ACTION_PERMS:["DELETE_ROLE"]}),async (req,res) => {  
    
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
        toDelete = awaitRoledeleteMany({_id: {$in:req.body.ids} });
        if(!(toDelete.deletedCount === req.body.ids.length)){
            await user.deleteMany({role: {$in:req.body.ids}}) // to delete all the users having the deleted roles
            return res.status(500).json({status:"failure",message:"Something went wrong, All roles could not be deleted"})
        }
        await user.deleteMany({role: {$in:req.body.ids}}) // to delete all the users having the deleted roles
    } catch(e) {
        console.log("Error: "+e)

        if (e instanceof mongoose.Error) {
            return res.status(500).json({status:"failure",message:"Failed to query Database"})

        }else{
            
            return res.status(500).json({status:"failure",message:"Some unknown error occured"})

        }
    }
        return res.json({status : "success", message : "Role deleted Successfully!"});
    


});

module.exports = router