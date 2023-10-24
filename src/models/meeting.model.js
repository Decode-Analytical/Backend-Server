const mongoose = require('mongoose');

const meetupSchema = new mongoose.Schema({
    instructor: {
        type: String,
        required: [ true, 'Name is required' ]
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
        required: [ true, 'Course is required' ]
    },
    courseName: {
        type: String,
        required: [ true, 'Course is required' ]
    },
    instructorId: {
        type: String,
        required: [ true, 'Organizer is required' ]
    },
    room: {
        type: String,
        required: [ true, 'Link is required' ]
    },
},
{
    timestamps: true
});

module.exports = mongoose.model('Meeting', meetupSchema);
