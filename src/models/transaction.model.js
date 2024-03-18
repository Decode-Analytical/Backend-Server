const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    },
    tutorId: {
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
},
    {
        timestamps: true
    });



module.exports = mongoose.model('Transaction', transactionSchema);