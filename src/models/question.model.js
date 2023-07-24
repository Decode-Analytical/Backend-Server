const mongoose = require('mongoose');


const questionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    question: {
        type: String,
        required: true ['write the question here']
    },
    choices: {
        type: [String],
        required: true ['write the choices here']
    },
    correctAnswer: {
        type: String,
        required: true ['write the correct answer here']
  },
});

module.exports = mongoose.model('Question', questionSchema);