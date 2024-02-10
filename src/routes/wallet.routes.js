const express = require('express');
const walletController = require('../controllers/wallet.controller')
const router = express.Router();
const { auth } = require('../middleware/auth');


router.use(auth);
router.post('/transfer', walletController.makeTransfer );
router.get('/getTransactions', walletController.viewTransferTransactions );
router.get('/getBalance', walletController.viewWalletBalance );



module.exports = router;