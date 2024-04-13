const express = require('express');
const walletController = require('../controllers/wallet.controller')
const router = express.Router();
const { auth } = require('../middleware/auth');


router.use(auth);
router.post('/transfer', walletController.makeTransfer );
router.get('/getTransactions', walletController.viewTransferTransactions );
router.get('/getBalance', walletController.viewWalletBalance );
router.get('/getEarningsHistory', walletController.viewOwnerEarnings );
router.get('/getWithdrawal', walletController.calculateWithdrawalBalance );
router.get('/viewOwnerTotalBalance', walletController.viewOwnerTotalBalance );
router.get('/verifyAccountName', walletController.verifyAccountName );




module.exports = router;