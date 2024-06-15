const mongoose = require('mongoose');

const meetupSchema = new mongoose.Schema({
    instructor: {
        type: String,
        required: [ true, 'Instructor Name is required' ]
    },
    startDate: {
        type: String,
        required: [ true, 'Start date is required' ]
    },
    startTime: {
        type: String,
        required: [ true, 'End date is required' ]
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
        trim: true,
        required: [ true, 'Course is required' ]
    },
    instructorId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [ true, 'Link is required' ],
        ref: "User"
    },
    duration: {
        type: Number,
        required: [ true, 'Duration is required' ],
        validate: {
            validator: function(v) {
                return v > 0;
            },
            message: 'Duration must be greater than 0'
        },
        set: function(v) {
            return v * 60 * 60;
        }
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
