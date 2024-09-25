const mongoose = require('mongoose');
const {Schema} = mongoose;
const FIRSchema = new Schema({
    
    FIR_Date:{
        type: Date,
        default: Date.now
    },
    // Police_Station_ID:{
    //     type: Number,
    //     require: true
    // },
    Victim_Name:{
        type: String,
        required: true
    },
    Officers_Name:{
        type: String,
        required: true
    },
    Address:{
        type: String,
        required: true
    },
    Zip:{
        type: Number,
        required: true
    },
    Contact_Number:{
        type: Number,
        required: true
    },
    Relation_with_accused:{
        type: String,
        required: true
    },
    Name_of_accused:{
        type: String,
        required: true
    },
    Type_of_incident:{
        type: String,
        required: true
    },
    Incident_Highlight: {
        type: String,
        required: true
    },
    Incident_details:{
        type: String,
        required: true
    },
    Penal_code:{
        type: String,
        required: true
    },
    Location: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
          },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    Weapons_Used: { type: String  },
    Damage_Caused: { type : String },
    Crime_City: {
        type : String,
        required: true
    },
    Crime_State: {
        type : String,
        required: true
    },
    Timestamp_of_Crime: {type:Date,required: true}
});
FIRSchema.index({ Location: '2dsphere'})
FIRSchema.index({Incident_Highlight: 'text',Incident_details:'text' },{weights: {
    Incident_Highlight: 5,
    Incident_details:2
}});
FIRSchema.index({Address: 'text' });
module.exports = mongoose.model('FIR', FIRSchema)