const {instance} = require("../db.js");
const crypto = require("crypto")
const Customer = require('../models/Customer.js')
const CustomerPayment = require('../models/CustomerPayments.js');
const { default: mongoose } = require("mongoose");

// this method will return razorpay key or seceret
const getKey = async (req,res)=>{
    return res.status(200).json({
        key:process.env.RAZORPAY_API_KEY
    })    
}

// this method will create a order made by user
const checkout = async (req, res) => {
  try {
  
    const {table,date,time,name,gmail,paymentMethod,noOfPerson,number} = req.body.Reservation
    const {amount} = req.body
    const options = {
      amount: Number(amount * 100),
      currency: "INR",
    };

    const order = await instance.orders.create(options);

    // if order is created then stored this customer who made the order in database and send this customer id for further use
    const customer = await Customer.create({
      table,
      date,
      time,
      name,
      gmail,
      paymentMethod,
      noOfPerson,
      number
    })

    return res.status(200).json({
      success: true,
      order,
      customer_id:customer._id
    });

  } catch (error) {
    console.log(error.message);
  }
};

// this method will verify the payment means the actual money has been deducted and once payment is verified we will modify the customer property isPaymentDone to true,

// this function is hit by razorpay and will pass razorpay_payment_id , razorpay_order_id and razorpay_signature on req body saved them in your server . and after that in order to verify the payment we run the hmac algorithm on payment_id and order_id

const paymentVerification = async (req, res) => {

  try {
    
    console.log(req.body)
    console.log(req.params.customerId)
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    console.log(req.body)

    let body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
      .update(body.toString())
      .digest("hex");
    console.log("sig received ", razorpay_signature);
    console.log("sig generated ", expectedSignature);

    const isAuthentic = expectedSignature === razorpay_signature

    if(isAuthentic){
       
      if(!mongoose.Types.ObjectId.isValid(req.params.customerId)){
        return res.status(404).json("Not a valid Customer")
      }
      
      await CustomerPayment.create({
        Payment_id:razorpay_payment_id,
        Order_id:razorpay_order_id,
        customer:req.params.customerId
      })

       // then redirect to front end not to /paymentverfication on backend 
       res.redirect(`http://localhost:3000/`)
    }
    else{
        return res.status(200).json({
            sucess: false,
          });
    }

  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
    checkout,
    paymentVerification,
    getKey
}