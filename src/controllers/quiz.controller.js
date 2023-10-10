const { Course, Module, Question, Answer, Submission, Quiz} = require('../models/course.model');
const User = require('../models/user.model');

exports.createQuizQuestions = async (req, res) => {
    try {
        const id = req.user;
        const moduleId = req.params.moduleId;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);
        if(userStatus.roles === "admin" || userStatus.roles === "teacher") {
            const { question, options, question_duration, question_description, correct_answer, correct_answer_index } = req.body;
            const quizQuestions = await Question.create({
                userId: userStatus._id,
                question_description,
                question_duration,
                question,                
                options,
                correct_answer,
                moduleId,
                correct_answer_index
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
        // console.log({userStatus})

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
            const { question, options, question_description, question_duration, correct_answer } = req.body;
            const quizQuestions = await Question.findOneAndUpdate({ _id: req.params.id }, { question, options, question_description, question_duration, correct_answer });
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

/** Create a new quiz. A quiz contain series of questions with options and correct answers */
exports.createQuiz = async (req, res) => {
  try {
    const id = req.user;
    const moduleId = req.params.moduleId;
    req.body.moduleId = moduleId;

    const user = await User.findById(id, "_id roles");
    if (user.roles === "admin" || user.roles === "teacher") {
      const newQuiz = await Quiz.create({...req.body});
      await newQuiz.populate("questions");
      res
        .status(200)
        .json({ message: "new quiz created successfully", newQuiz });
    } else res.status(401).send("You are not authorized to do this action");
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      message: "Error saving quiz questions.",
      error: error.message,
    });
  }
};
/*** Get a quiz by id */
exports.getQuizById = async (req, res) =>{
    try{
        const quiz = await Quiz.findById(req.params.quizId).populate("questions");
        if (!quiz) {
          return res.status(404).send({ message: "quiz not found" });
        }
        // await quiz.populate("questions")
        res.status(200).json({message: "quiz is available", quiz});
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
}

exports.submitQuiz = async (req, res) => {
  try {
    const userId = req.user.id;
    const { quizId, answers } = req.body;

    const quiz = await Quiz.findById(quizId);
    let score = 0;

    for (const answer of answers) {
      //check answer submitted for each question in the quiz
      const question = await Question.findById(answer.questionId);

      if (question.correct_answer_index === answer.selected_answer_index) {
        score++;
      }
    }
    // Create a submission record
    const submission = new Submission({
      userId,
      quizId,
      answers,
      score,
    });

    await submission.save();
    res.status(200).json({ message: "quiz submitted successfully", score });

  } catch (err) {
    res
      .status(500)
      .send({
        message: "error occurred while submitting quiz",
        error: err.message,
      });
  }
};

exports.getQuizSubmission = async (req, res) => {

}
