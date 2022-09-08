const mongoose = require('mongoose');

const customerSchema = mongoose.Schema({

    name:{
        type:String,
        required:true,
        trim:true
    },
    gmail:{
        type:String,
        required:true,
        trim:true
    },
    number:{
        type:Number,
        required:true,
        trim:true
    },
    paymentMethod:{
        type:String,
        required:true,
        trim:true
    },
    noOfPerson:{
        type:Number,
        required:true,
        trim:true
    },
    table:{
        type:String,
        required:true,
        trim:true
    },
    date:{
        type:Date,
        required:true,
        trim:true
    },
    time:{
        type:String,
        required:true,
        trim:true
    },
    isPaymentDone:{
        type:Boolean,
        default:false
    }
})

module.exports = mongoose.model("Customer",customerSchema)