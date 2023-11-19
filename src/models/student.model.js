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
    module_duration: {
      type: String,
    },
    video: {
      type: Array,
    },
    module_title: {
      type: String,
    },
    module_description: {
      type: String,
    },
    module_image: {
      type: Array,
    },
    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Module',
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Student', studentSchema);
