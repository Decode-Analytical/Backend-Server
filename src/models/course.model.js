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
  nameOfSubject: {
    type: Array,    
  },
},
{
  timestamps: true,
  versionKey: false,
});

module.exports = mongoose.model('Course', courseSchema);