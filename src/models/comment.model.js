const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    comment: String,
    course_id: String,
    comment_id: String,
    owner_id: String,
    owner_name: String,
    owner_img: String,
    edited: {type: Boolean, default: false},
    likes: [String],
    like_count: {type: Number, default: 0},
    dislikes: [String],
    dislike_count: {type: Number, default: 0},
    reply_count: {type: Number, default: 0}
   
},  {timestamps: true},
{collection: 'comments'});

const model = mongoose.model('Comment', commentSchema);
module.exports = model; 
