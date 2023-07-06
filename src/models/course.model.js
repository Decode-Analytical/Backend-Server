const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    summary: {
      type: String,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    objectives: {
      type: String,
      required: true,
    },
    requirements: {
      type: String,
      required: true,
    },
    sold: {
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
        required: true,
      },
    ],
    ratings: [
      {
        star: Number,
        postedby: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
    totalrating: {
      type: String,
      default: 0,
    },
    tutor_id: {
      type: String,
    },
    users_id: [
      {
        type: String,
      },
    ],
    video: [
      {
        name: {
          type: String,
          required: true,
        },
        url: {
          type: String,
        },
        cloudinary_id: {
          type: String,
        },
        description: {
          type: String,
          required: true,
        },
      },
    ],
    audio: [
      {
        name: {
          type: String,
          required: true,
        },
        url: {
          type: String,
        },
        cloudinary_id: {
          type: String,
        },
        description: {
          type: String,
          required: true,
        },
      },
    ],
    image: [
      {
        name: {
          type: String,
          required: true,
        },
        url: {
          type: String,
        },
        cloudinary_id: {
          type: String,
        },
        description: {
          type: String,
          required: true,
        },
      },
    ],
    docs: [
      {
        name: {
          type: String,
          required: true,
        },
        url: {
          type: String,
        },
        cloudinary_id: {
          type: String,
        },
        description: {
          type: String,
          required: true,
        },
      },
    ],
    Paid: {
      type: Boolean,
      required: true,
    },
    comment_count: { type: Number, default: 0 },
    like_count: { type: Number, default: 0 },
    dislike_count: { type: Number, default: 0 },
    dislikes: [String],
    likes: [String],
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
