const mongoose = require('mongoose');

const walletTransactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    amount: {
        type: Number,
    },
    reference: {
        type: String,
    },
    email: {
        type: String,
    },
    title: {
        type: String,
    },
    transfer_status: {
        type: String,
        default: 'success',
    },
    transfer_code: {
        type: String,
    },
    bank_name: {
        type: String,
    },
    account_number: {
        type: String,
    },
    reason: {
        type: String,
    },
},
    {
        timestamps: true
    });



module.exports = mongoose.model('WalletTransaction', walletTransactionSchema);