const mongoose = require('mongoose');

// Define the Subject schema
const subjectSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
  nameOfSubject: {
    type: String,
    index: true
  },
  questions: {
    type: Array,
    default: [],
  },
  summary: {
    type: String,
    lowercase: true,
  },
  description: {
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
  video: {
    type: Array,
  },
  videoLength: {
    type: String,
  },
  audio: {
      type: Array,
    },
    docs: {
      type: Array,
    },
    comments: {
      type: Array,
    },
    comment_count: { type: Number, default: 0 },
    like_count: { type: Number, default: 0 },
    dislike_count: { type: Number, default: 0 },

});

module.exports = mongoose.model('Subject', subjectSchema);