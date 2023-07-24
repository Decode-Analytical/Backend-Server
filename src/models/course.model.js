const mongoose = require("mongoose"); 


// Define the Course schema
const courseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  title: {
    type: String,
    required: true ['write the title of course'],
  },
  description: {
    type: String,
  },
  language: {
    type: String,
  },
  price: {
    type: Number,
    required: true ["Pls, enter the price"]
  },
  nameOfSubject: {
    type: Array,    
  },  
  comments: {
    type: Array,
  },
  comment_count: { type: Number, default: 0 },
  like_count: { type: Number, default: 0 },
  dislike_count: { type: Number, default: 0 },

},
{
  timestamps: true,
  versionKey: false,
});

module.exports = mongoose.model('Course', courseSchema);