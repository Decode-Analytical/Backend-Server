const Question = require('../models/question.model');
const User = require('../models/user.model');



exports.createQuizQuestions = async (req, res) => {
    try {
        const id = req.user;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);
        if(userStatus.roles === "admin" || userStatus.roles === "teacher") {
            const { question, choices, correctAnswer } = req.body;
            const quizQuestions = await Question.create({
                userId: userStatus._id,
                question,
                choices,
                correctAnswer,
            })
            return res.status(200).json({
                message: 'Quiz questions saved to the database.',
                quizQuestions
            });
        } else {
            return res.status(401).json({
                message: 'You are not authorized to do this action.'
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Error saving quiz questions.',
            error: error.message
        });
    }
}


exports.getQuizQuestions = async (req, res) => {
    try {
        const id = req.user;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);
        if(userStatus.roles === "admin" || userStatus.roles === "teacher") {
            const quizQuestions = await Question.find({});
            return res.status(200).json({
                message: 'Quiz questions retrieved from the database.',
                quizQuestions: quizQuestions
            });
        } else {
            return res.status(401).json({
                message: 'You are not authorized to do this action.'
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Error retrieving quiz questions.',
            error: error.message
        });
    }
}

// update the quiz questions

exports.updateQuizQuestions = async (req, res) => {
    try {
        const id = req.user;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);
        if(userStatus.roles === "admin" || userStatus.roles === "teacher") {
            const { question, choices, correctAnswer } = req.body;
            const quizQuestions = await Question.findOneAndUpdate({ _id: req.params.id }, { question, choices, correctAnswer });
            return res.status(200).json({
                message: 'Quiz questions updated.',
                quizQuestions
            });
        } else {
            return res.status(401).json({
                message: 'You are not authorized to do this action.'
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Error updating quiz questions.',
            error: error.message
        });
    }
}

// delete quiz questions

exports.deleteQuizQuestions = async (req, res) => {
    try {
        const id = req.user;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);
        if(userStatus.roles === "admin" || userStatus.roles === "teacher") {
            const ownerId = await Question.findById(req.params.id);
            if(ownerId.userId === userStatus._id) {
                const quizQuestions = await Question.findOneAndDelete({ _id: req.params.id });
                return res.status(200).json({
                    message: 'Quiz questions deleted.',
                    quizQuestions
                });
            } else {
                return res.status(401).json({
                    message: 'You are not the owner of this question.'
                });
            }
        } else {
            return res.status(401).json({
                message: 'You are not authorized to do this action.'
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: "Error deleting quiz questions.",
            error: error.message
        });
    }
}

// get quiz questions by id

exports.getQuizQuestionsById = async (req, res) => {
    try {
        const id = req.user;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);
        if(userStatus.roles === "admin" || userStatus.roles === "teacher") {
            const quizQuestions = await Question.findById(req.params.id);
            return res.status(200).json({
                message: 'Quiz questions retrieved from the database.',
                quizQuestions
            });
        } else {
            return res.status(401).json({
                message: 'You are not authorized to do this action.'
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Error retrieving quiz questions.',
            error: error.message
        });
    }
}


