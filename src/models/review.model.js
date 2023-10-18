const mongoose = require('mongoose');


const reviewSchema = new mongoose.Schema({
    review: {type: String, required: true},
    rating: {type: Number, required: true},
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    courseId: {type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true}
},
{
    timestamps: true
});

module.exports = mongoose.model('Review', reviewSchema)