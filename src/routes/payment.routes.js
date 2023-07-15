const express = require('express');
const { paystackPayment, decodePaystack } = require('../controllers/paystack.controller');
const router = express.Router();


router.post('/initializedPayment', paystackPayment);
router.post('/RecievedPayment', decodePaystack);



module.exports = router;