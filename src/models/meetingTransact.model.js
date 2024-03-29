const mongoose = require('mongoose');


const meetingTransactionSchema = new mongoose.Schema({
    meetingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Meeting',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tutorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  transactionType: {
    type: String,
    enum: ['paid', 'refunded'],
    default: 'refunded',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    float: true
  },
  reference: {
    type: String,
    required: true
  },
  email: {
    type: String
  }
},
{
    timestamps: true
}
);


module.exports = mongoose.model('MeetingTransaction', meetingTransactionSchema);