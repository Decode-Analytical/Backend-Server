const mongoose = require('mongoose');


const certificateSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    course_id: {
        type: String,
        required: true
    },
    student_id: {
        type: String,
        required: true
    },
    certificateCode: {
        type: String,
        required: true
    },
    studentName: {
        type: String,
        required: true
    },
    courseName: {
        type: String,
        required: true
    },
}, { timestamps: true });


module.exports = mongoose.model('Certificate', certificateSchema);