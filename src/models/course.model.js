const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
const courseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  title: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    summary: {
      type: String,
      lowercase: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
    },
    category: {
      type: String,
    },
    language: {
      type: String,
    },
    objectives: {
      type: String,
    },
    requirements: {
      type: String,
    },
    manySold: {
      type: Number,
      default: 0,
      select: false,
    },
    images: {
      type: Array,
    },
    currriculum: [
      {
        type: String,
      },
    ],
    totalrating: {
      type: String,
      default: 0,
    },
    tutor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    video: {
      type: Array,
    },
    audio: {
      type: Array,
    },
    docs: {
      type: Array,
    },
    comments:[
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
        required: false, 
      },
    ],
    likeAndDislikeUsers:[
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false, 
      },
    ],
    comment_count: { type: Number, default: 0 },
    like_count: { type: Number, default: 0 },
    dislike_count: { type: Number, default: 0 },
  
  },
  { timestamps: true }
);

// Course document relationship with other document (to enable populate)
courseSchema.virtual("students", {
  ref: "Student",
  localField: "_id",
  foreignField: "orderCourses.courses",
});

courseSchema.virtual("tutors", {
  ref: "Tutor",
  localField: "_id",
  foreignField: "courses",
});

//Export the model
module.exports = mongoose.model("Course", courseSchema);
