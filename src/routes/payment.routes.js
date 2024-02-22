const express = require('express');
const { auth } = require('../middleware/auth');
const { paystackPayment, decodePaystack } = require('../controllers/paystack.controller');
const router = express.Router();


router.post('/recievedPayment', decodePaystack);
router.use(auth);
router.post('/initializedPayment/:courseId', paystackPayment);



module.exports = router; 