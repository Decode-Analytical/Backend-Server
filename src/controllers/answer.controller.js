const Answer = require('../models/answer.model');
const User = require('../models/user.model');
const Questions = require('../models/quiz.model');


exports.studentViewAnswers = async(req, res) => {
    try {
        const id = req.user;
        const user = User.findById(id);
        const userStatus = await User.findById(user._id);
        if (userStatus.status === 'student' || userStatus.status === 'IT') {
            const answers = await Answer.find({ userId: userStatus._id });
            return res.status(200).json({
                answers: answers
            });
        } else {
            return res.status(400).json({
                error: 'User not active'
            });
        }
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};



// take examination and answer the questions using inquirer

exports.answerQuestion = async(req, res) => {
    try {
        const id = req.user;
        const user = User.findById(id);
        const userStatus = await User.findById(user._id);
        if (userStatus.status === 'student' || userStatus.status === 'IT') {
            const questionId = req.params.questionId;
            const questions = await Questions.findById(questionId);  
            const answerId = await Answer.create({
                questionId: questions._id,
                answer: answer.correctAnswer,
                userId: userStatus._id
            });
            return res.status(200).json({
                answerId: answerId
            });
        } else {
            res.status(400).json({
                error: 'User not active'
            });
        }
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};



