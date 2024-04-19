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
    calibration: {
      type: Number,
      default: '0',
      enum: [ '1', '2', '3', '4', '5', '6', '7', '8', '9', '10' ],
      match: /[1-9]/,
      validate: {
        validator: function (v) {
          return /[1-9]/.test(v);
        },
        message: (props) => `${props.value} is not a valid number`,
      }
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
