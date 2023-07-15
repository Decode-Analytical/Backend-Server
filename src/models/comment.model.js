const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    comment: {
        type: String,
    },
    courseId: {
        type: String,
    },
    ownerId: {
        type: String,
    },
    owner_name: { 
        type: String,
    },
    edited: {type: Boolean, default: false},
    like_count: {type: Number, default: 0},
    dislikes: {
        type: Array,
        default: []
    },
    like: {type: Boolean, default: false},
    dislike: {type: Boolean, default: false},
    dislike_count: {type: Number, default: 0},
    reply_count: {type: Number, default: 0}
   
},   {timestamps: true});

module.exports = mongoose.model('Comment', commentSchema);