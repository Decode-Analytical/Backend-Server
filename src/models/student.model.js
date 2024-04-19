const mongoose = require('mongoose');

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
    
  },
  {
    collection:'students',
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Student', studentSchema);
