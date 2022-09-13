const mysql = require("mysql");
const Razorpay = require("razorpay");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "kingrestaurantandbar",
});

// the instance of razorpay contain all method provided by razorpay API
const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

module.exports = {
  db,
  instance,
};
