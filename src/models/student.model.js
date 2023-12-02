const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
  
    _id: false, // To indicate that this schema won't have a separate _id field
    module_title: String,
    module_description: String,
    video: [{
        fieldname: String,
        originalname: String,
        encoding: String,
        mimetype: String,
        path: String,
        size: Number,
        filename: String
    }],
    image: [{
        fieldname: String,
        originalname: String,
        encoding: String,
        mimetype: String,
        path: String,
        size: Number,
        filename: String
    }],
    audio: [{
        fieldname: String,
        originalname: String,
        encoding: String,
        mimetype: String,
        path: String,
        size: Number,
        filename: String
    }],
    module_duration: String,
    quizzes: [String],
    like_count: Number,
    dislike_count: Number,
    isCompleted: {
        type: Boolean,
        default: false
    }
});

const studentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: [true, 'This course is required'],
    },
    title: {
        type: String,
    },
    price: {
        type: mongoose.Decimal128,
    },
    image: {
        type: Array,
    },
    description: {
        type: String,
    },
    module: [moduleSchema], // Use the module schema for the array
},
{
    collection: 'students',
},
{
    timestamps: true,
});

module.exports = mongoose.model('Student', studentSchema);
