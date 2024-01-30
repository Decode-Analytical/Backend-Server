const express = require('express');
const walletController = require('../controllers/wallet.controller')
const router = express.Router();
const { auth } = require('../middleware/auth');


router.use(auth);
router.post('/transfer', walletController.makeTransfer );
router.post('/verifyTransfer', walletController.updateTransaction );



module.exports = router;