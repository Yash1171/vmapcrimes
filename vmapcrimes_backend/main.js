const express = require('express');
const { expressjwt : ejwt } = require("express-jwt");
var cookieParser = require('cookie-parser');
const cors = require('cors')
const  {makeSecretKey} = require("./util")

const config = require('./config/defaultConfig')
const connectToDB = require('.\\db.js');
const authRoutes = require('./routes/authRoutes');
const usersRoutes = require('./routes/usersRoutes');
const rolesRoutes = require('./routes/rolesRoutes');
const firRoutes = require('./routes/firRoutes')
const fetchRoutes = require('./routes/fetchRoutes')

require('dotenv').config();
connectToDB();

const app = express();

// useful third party middlewares 
app.use(cookieParser());
app.use(express.json());
var corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 ,// some legacy browsers (IE11, various SmartTVs) choke on 204
  credentials : true
  }
app.use(cors(corsOptions));

app.get('/', (req,res)=> {
  res.send("Hello World");
})
const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log("App started");
  console.log(`VMapCrimes app is listening on port ${port}`);
})

app.use(ejwt({secret: makeSecretKey,algorithms : ['HS256'],getToken: (req) => {
  if(!req.cookies || !req.cookies['auth-token']) {
      
      return null;
  }
  return req.cookies['auth-token'];
},
// onExpired : async (req,err)=> {
  
//     throw "Session Token expired"
//   }
}).unless({path: config.PUBLICLY_ACCESSIBLE_PAGES}));

app.use('/api/roles',rolesRoutes);

app.use('/api/users', usersRoutes);

app.use('/api/data', firRoutes);

app.use('/api/auth',authRoutes);

app.use('/api/fetch',fetchRoutes)

// Handle generic bad request errors
app.use((err, req, res, next) => { 
  if (err.status === 401 ) {
    console.log(err)
    if(err.name === "UnauthorizedError") {
      if(err.inner.name==="TokenExpiredError") {
        return res.status(401).json({status:"failure",message:"JWT Token expired,please login"});
      }else {

        return res.status(401).json({status:"failure",message:"JWT Token absent or invalid,please login again"});

      }
  
    }
    return res.status(400).send("Bad request");
  }
  next()
})