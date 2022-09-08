const mongoose = require('mongoose');
const Razorpay = require('razorpay')

const connectToMongo = (URL)=>{
    
    console.log("CONNECTED TO MONGO")
    return mongoose.connect(URL);
}

// the instance of razorpay contain all method provided by razorpay API
const instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET , 
});

module.exports = {
    connectToMongo,
    instance
};