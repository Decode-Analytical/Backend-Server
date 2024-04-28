const mongoose = require('mongoose');

const meetupSchema = new mongoose.Schema({
    instructor: {
        type: String,
        required: [ true, 'Instructor Name is required' ]
    },
    date: {
        type: String,
        required: [ true, 'Date is required' ]
    },
    time: {
        type: String,
        required: [ true, 'Time is required' ]
    },
    description: {
        type: String,
        required: [ true, 'Description is required' ]
    },
    courseId: {
        type: String,
    },
    courseName: {
        type: String,
        required: [ true, 'Course is required' ]
    },
    instructorId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [ true, 'Link is required' ],
        ref: "User"
    },
    roomId: {
        type: String,
        required: [ true, 'Link is required' ]
    },
    email: {
        type: String,
    },
    isPaid: {
        type: String,
        enum: ['paid', 'free'],
        default: 'free'
    },
    amount: {
        type: Number,
        defualt: 0
    },
    course_image: {
        type: Array,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
},
{
    timestamps: true
});

module.exports = mongoose.model('Meeting', meetupSchema);
