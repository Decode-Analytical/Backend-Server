const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  like: {
    type: Number,
    enum: [0, 1, -1], //has the student like the course or not
    required: true,
    default: 0,
  },
  commented: {
    type: Boolean,
    default: false,
  },
});

const studentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    registeredCourses: [likeSchema], //needed instead of using courseId bcoz a student can have more than one course
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