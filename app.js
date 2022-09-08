const app = require('express')();
const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator')
const cors = require('cors');
const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,            
    optionSuccessStatus:200
}
const paymentRoutes = require('./routes/paymentRoutes.js');

const {connectToMongo,instance} = require('./db.js');

const PORT = process.env.PORT || 4000;

// MIDDLEWARE
app.use([ cors(corsOptions) , bodyParser.json() , bodyParser.urlencoded({extended:true}) , expressValidator() ])

// Routes
app.use("/api",paymentRoutes);

// DATABASE CONNECTION
const start = async(URL)=>{
      
    try {
       
       await connectToMongo(URL); 
       app.listen( PORT , ()=>{
       
        console.log(` Server is listening on port ${PORT} `)

       })
        
    } catch (error) {
        console.log(error)
    }
}

start(process.env.CONNECTION_URL);