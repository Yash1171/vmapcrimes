
const verifyIP =  (ip_addr) => {

    return (req,res,next) => {
        
        if (req.ip !== ip_addr){
            return res.status(401).send("You are not authorized to view this page");
        }

        next();
    }

}

module.exports = verifyIP;