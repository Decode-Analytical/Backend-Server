const express = require('express');
const { auth } = require('../middleware/auth');
const { paystackPayment, decodePaystack } = require('../controllers/paystack.controller');
const router = express.Router();

router.use(auth);
router.post('/initializedPayment/:courseId', paystackPayment);
router.post('/RecievedPayment', decodePaystack);



module.exports = router;      