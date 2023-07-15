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
    },
    registeredCourses: [  //needed instead of using courseId
      { type: mongoose.Schema.Types.ObjectId, 
        ref: "Course", 
        like: {
          type: number,
          enum: [0, 1, -1],
          required: true,
          default: 0
        }
      },
    ],
    title: {
      type: String,
    },    
    price: {
      type: Number,
    },
    category: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Student', studentSchema);