const mongoose = require('mongoose');
const { Schema } = mongoose

const UserSchema = new Schema({

    "name" : { type: String, required : true},
    "email" : { type : String, unique : true, required: true },
    "address" : { type : String , required : true},
    "phone" : {type : String , unique : true, required : true},
    "password" : {type:  String, required: true},
    "role" : {type: mongoose.Schema.Types.ObjectId ,ref : 'roles'},
    "private_key" : {type: String, required: true}
})

module.exports = mongoose.model('user',UserSchema);

