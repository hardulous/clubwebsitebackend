const { instance } = require("../db.js");
const crypto = require("crypto");
const { db } = require("../db.js");

// this method will return razorpay key or seceret
const getKey = async (req, res) => {
  return res.status(200).json({
    key: process.env.RAZORPAY_API_KEY,
  });
};

// this method will create a order made by user
const checkout = async (req, res) => {
  try {
    const {
      table,
      date,
      time,
      name,
      gmail,
      noOfPerson,
      number,
    } = req.body.Reservation;
    const { amount } = req.body;
    const options = {
      amount: Number(amount * 100),
      currency: "INR",
    };

    const order = await instance.orders.create(options);

    // if order is created then stored this customer who made the order in database and send this customer id for further use
    let sql = `INSERT INTO customer(cus_name,cus_email,cus_number,no_of_person,table_type,cus_date,time) VALUES('${name}','${gmail}',${number},${noOfPerson},'${table}','${date}','${time}');`;

    db.query(sql, (err, result) => {
      if (err) {
        console.log(err.message);
      } else {
        console.log(result);
        return res.status(200).json({
          success: true,
          order,
          linked_cus_id: result.insertId,
        });
      }
    });

  } catch (error) {
    console.log(error.message);
  }
};

// this method will verify the payment means the actual money has been deducted and once payment is verified we will modify the customer property isPaymentDone to true,

// this function is hit by razorpay and will pass razorpay_payment_id , razorpay_order_id and razorpay_signature on req body saved them in your server . and after that in order to verify the payment we run the hmac algorithm on payment_id and order_id

const paymentVerification = async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.params.customerId);
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
      req.body;

    console.log(req.body);

    let body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
      .update(body.toString())
      .digest("hex");
    console.log("sig received ", razorpay_signature);
    console.log("sig generated ", expectedSignature);

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      
      let sql = `INSERT INTO customer_payment(payment_id,order_id,linked_cus_id) VALUES('${razorpay_payment_id}','${razorpay_order_id}',${req.params.customerId});`

      db.query(sql, (err, result) => {
        if (err) {
          console.log(err.message);
        } else {
          console.log(result);

          let sql = `UPDATE customer SET is_payment_done = 1 WHERE cus_id = ${req.params.customerId};`

          db.query(sql,(err,result)=>{
            if(err){
              console.log(err.message)
            }else{
              // then redirect to front end not to /paymentverfication on backend
              res.redirect(`http://localhost:3000/`);
            }
          })

        }
      });

     
    } else {
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
  getKey,
};
