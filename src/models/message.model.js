const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    message: {
      type: String,
    },
    name: {
      type: String,
    },
    timestamp: {
      type: Date,
      default: Date.now
    }, // Add any additional fields you may need for your chat model
   });

   const Message = mongoose.model('Message', messageSchema);
   module.exports = Message;