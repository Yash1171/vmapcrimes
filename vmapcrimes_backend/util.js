
const User = require("./models/User")
require("dotenv").config();
const makeid = (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

const makeSecretKey = async (req,token) => {
    var userid = token.payload.id
    try {
        const user = await User.findOne({_id:userid});
        if(user) {
            const privkey = user.private_key
            var key = process.env.JWT_SECRET_KEY+user.private_key
            return key
        } else{

            return null
        }
    }catch(e) {
        return null
    }
    


}

module.exports = { makeid ,makeSecretKey}