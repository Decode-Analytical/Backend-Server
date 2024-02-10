const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    },
    message: {
      type: String,
    },
    name: {
      type: String,
    },
   },
   {
    timestamps: true,
   });

   const Message = mongoose.model('Message', messageSchema);
   module.exports = Message;