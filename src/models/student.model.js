const mongoose = require('mongoose');
const referralCodeGenerator = require('referral-code-generator');

const studentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    courseOwnerId: {
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
      type: Number,
      float: true
    },
    image: {
      type: Array,
    },
    description: {
      type: String,
    },
    module: {
      type: Array,
    },
    certificateCode: {
      type: String,
      default: referralCodeGenerator.custom('lowercase', 7, 7, 'DecodeAnalytics')
    },
    isCourseCompleted: {
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
