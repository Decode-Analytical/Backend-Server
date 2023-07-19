const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
   
},   
{timestamps: true});

module.exports = mongoose.model('Comment', commentSchema);