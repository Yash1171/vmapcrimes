const mongoose = require("mongoose");
const { Schema } = mongoose;
const user = require("./User")

const Roles = Schema ({
    "name" : {
        type : String,
        unique: true,
        default: 'public'

    },
    "read_perms" : {
        type: [String],
        default: ['None']
    },
    "action_perms" : {
        type: [String],
        default: ['None']
    }
})

Roles.post("remove", { document: true, query: false },async (doc)=> {
    let users;
    console.log("In post hook of findOneAndDelete")
    try {
        users = user.deleteMany({role : doc._id});
    }catch(e){
        console.log("While running post hook on role for findOneAndDelete:\n" + e)
            return res.status(500).json({status:"failure",message:"Some unknown error occured"});
    }
}) 

// Roles.post("deleteMany", { document: true, query: false },async (doc)=> {
//     let users;
//     try {
//         users = user.deleteMany({role : doc._id});
//     }catch(e){
//         console.log("While running post hook on role for deleteMany:\n" + e)
//             return res.status(500).json({status:"failure",message:"Some unknown error occured"});
//     }
// }) 
module.exports = mongoose.model('roles', Roles);
