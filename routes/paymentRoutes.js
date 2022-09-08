const express = require('express');
const { checkout , paymentVerification , getKey } = require('../controllers/paymentControllers.js')

const router = express.Router();

// /api/checkout
router.route("/checkout").post(checkout);

// /api/paymentverification
router.route("/paymentverification/:customerId").post(paymentVerification)

// /api/getkey
router.route("/getkey").get(getKey)

module.exports = router