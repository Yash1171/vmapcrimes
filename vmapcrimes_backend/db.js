require("dotenv").config();
const User = require("./models/User")
const Role = require("./models/Roles")
const config  = require("./config/defaultConfig") 
const connString = process.env.DATABASE_URL+(process.env.DATABASE || 'test');
const mongoose = require('mongoose');
const bcrypt =  require('bcrypt');

const { makeid } = require('./util')
function connectToDB() {
        return new Promise(
                (res,rej) => {
                        mongoose.connect(connString, () => {console.log("Connected to MongoDB"); init()});
                }
        )

}

    
//Create collection if not exists (users,roles) initialize  admin and public roles and an admnin user with password defined in configuration file

const init = async( ) => {
        try {
                //check if admin and public roles exist already
                let adminExists = await Role.findOne({name : 'admin'});
                let publicExists = await Role.findOne({name: 'public'})
                //create admin and public roles
                if(!adminExists){

                        await Role.create({
                                name: "admin",
                        })
                }
                if(!publicExists){

                        await Role.create({
                                name : 'public',
                        })

                }
                //check if default admin exists in the database
                
        
                let defAdminExists = await User.findOne({name: config.DEFAULT_ADMIN_NAME})
                //create admin
                // calculate password hash

                const salt = await bcrypt.genSalt(10);
                const hashedPass = await bcrypt.hash(config.DEFAULT_ADMIN_PASS,salt);
                if(!defAdminExists) {
                        let adminRole = await Role.findOne({name : "admin"})
                        User.create({
                                name: config.DEFAULT_ADMIN_NAME,
                                password: hashedPass,
                                address: config.DEFAULT_ADMIN_ADDRESS,
                                email : config.DEFAULT_ADMIN_EMAIL,
                                phone: config.DEFAULT_ADMIN_PHONE,
                                role : adminRole,
                                private_key: makeid(7)
                        })

                }
                


        } catch (e) {
                console.log("Error  " + e)
            if (e instanceof mongoose.Error) {
                return console.log("Failed to query the database")
            }else{
                return console.log("Some Unknown error occured")

            }

        }

}

module.exports = connectToDB;