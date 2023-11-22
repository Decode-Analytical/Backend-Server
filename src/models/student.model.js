const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [ true, 'This course is required' ],
    },
    title: {
      type: String,
    },    
    price: {
      type: mongoose.Decimal128,
    },
    image: {
      type: Array,
    },
    description: {
      type: String,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection:'students',
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Student', studentSchema);
