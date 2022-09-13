const app = require('express')();
const dotenv = require('dotenv');
dotenv.config();
const bodyParser = require('body-parser');
const expressValidator = require('express-validator')
const cors = require('cors');
const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,            
    optionSuccessStatus:200
}

const paymentRoutes = require('./routes/paymentRoutes.js');

const {db,instance} = require('./db.js');

const PORT = process.env.PORT || 4000;

// MIDDLEWARE
app.use([ cors(corsOptions) , bodyParser.json() , bodyParser.urlencoded({extended:true}) , expressValidator() ])

// Routes
app.use("/api",paymentRoutes);

// DATABASE CONNECTION
db.connect((err)=>{
    if(err){
        console.log(err.message)
    }
    else{
        console.log("Connected to mysql")
        app.listen( PORT , ()=>{
   
            console.log(` Server is listening on port ${PORT} `)
    
           })
    }
})