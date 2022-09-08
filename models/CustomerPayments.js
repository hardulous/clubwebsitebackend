const mongoose = require('mongoose');

const PaymentSchema = mongoose.Schema({

    Payment_id:{
        type:String,
        required:true,
    },
    Order_id:{
        type:String,
        required:true,
    },
    customer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Customer"
    }

})

module.exports = mongoose.model("Payment",PaymentSchema)