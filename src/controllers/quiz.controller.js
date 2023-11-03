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

//////////////////////////////////////////////////////////////////////////////////////
/**Add questions and creating a quiz with the question simultaneously */
exports.createQuizWithQuestions = async (req, res) => {
    try {
        const id= req.user;
        const user = await User.findById(id);
        const moduleId = req.params.moduleId;
        if (user.roles === "admin") {
            const module = await Module.findById(moduleId);
            if(!module) {
                return res
                .status(404)
                .send({ message: 'Module not found' });
            }
            // const course = await Course.findById(module.courseId);
                const {questionsData} = req.body; // Array of questions

          // Map the moduleId into every question
          const questionsWithModuleId = questionsData.map((question) => ({
            ...question,
            moduleId // Attach moduleId to each question
          }));
          const createdQuestions = await Question.create(questionsWithModuleId);

          //!updating the module with the new questions IDs
            const questionsIds = createdQuestions.map((question) => question._id)
            // defining the
            module.questions = module.questions.concat(questionsIds)
            await module.save();

             //creating quiz with the questions
          const quiz = await Quiz.create({
            title: createdQuestions.question_title, questionIds: questionsIds, moduleId, questions: createdQuestions
          })

          //updating the module with the new quiz IDs using mapping 
          module.quizzes = module.quizzes.concat(quiz._id)
          await module.save();

          // save the answers for each question

            return res.status(201).json({
                message: "New Quiz has been created with new questions",
                quiz,
            });
        } else {
            return res.status(401).json({
            })
    }
        
    }
     catch (error) {
      return res.status(500).json({
        message: "Error occurred while adding questions",
        error: error.message,
      });
    }
}
/** Create a new quiz. A quiz contain series of questions with options and correct answers */
exports.createQuiz = async (req, res) => {
  try {
    const id = req.user;
    const moduleId = req.params.moduleId;
    req.body.moduleId = moduleId;
    const module = await Module.findById(moduleId)
    const user = await User.findById(id, "_id roles");

    if (user.roles === "admin" || user.roles === "teacher") {
      const newQuiz = await Quiz.create({...req.body});
      await newQuiz.populate("questions");
      return res
        .status(200)
        .json({ message: "new quiz created successfully", newQuiz });
    } 
    else return res
    .status(401)
    .send("You are not authorized to do this action");
  } 
  catch (error) {
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
        return res.status(200).json({message: "quiz is available", quiz});
    }
    catch(err){
        return res.status(500).json({error: err.message});
    }
}

/*** API for quiz submission. Expecting the quiz id and the answers selected for each question in the quiz */
// exports.submitQuiz = async (req, res) => {
//   try {
//     const userId = req.user.id;  
//     const {answers} = req.body;
//     const quizId = req.params.quizId;
// //  [{questionId, selectedAnswer}, {questionId, selectedAnswer}]
//     const quiz = await Quiz.findById(quizId).populate("questions");
//     // console.log(quiz);
//     if (!quiz) {
//         return res.status(404).send({ message: "quiz not found" });
//       }
//     let score = 0;
//     // const totalScore = 100

//     for (const answer of answers) { 
//       //check answer selected for each question in the quiz with the correct answer in the db
//       const question = await Question.findById(answer.questions, "options");
//       // if the answer is correct
//       if (answer.selected_answer_index === question.correct_answer_index) {
//         score++;
//       }
//       // if the answer is wrong
//       else if (answer.selected_answer_index!== question.correct_answer_index) {
//         score;
//       }
//     }
//     // if the quiz has been completed
//     if (answers.length === quiz.questions.length) {
//       // if the score is 100, the quiz is completed
//       if (score === quiz.questions.length) {
//         // create a submission record
//         const submission = new Submission({
//           userId,
//           quizId,
//           answers,
//           score,
//         });
//         await submission.save();
//         return res.status(200).json({ message: "quiz submitted successfully", score, submission});
//       }
//     } else {
//       const submission = new Submission({
//         userId,
//         quizId,
//         answers,
//         score,
//       });
//       await submission.save();
//       return res.status(200).json({ message: "quiz submitted successfully", score, submission});
//     }

//   } catch (err) {
//     return res
//       .status(500)
//       .send({
//         message: "error occurred while submitting quiz",
//         error: err.message,
//       });
//   }
// };

exports.getQuizSubmittedById = async (req, res) => {
    try{
        const submissionResult = await Submission.findById(req.params.submissionId);
        if(!submissionResult){
            return res.status(404).send({message: "submission not found"});
        }
        return res.status(200).json({message:"submission available", submissionResult});
    }
    catch(err){
        return res.status(500).send({message: "failed to find submission", error: err.message});
    }
}

// get and populate all the question IDs for a quiz 
exports.getQuizQuestionId = async (req, res) => {
    try {
        const id = req.user;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);
        if(userStatus.roles === "admin" || userStatus.roles === "student" || userStatus.roles === "IT") {
            const quiz = await Quiz.findById(req.params.quizId);
            const questions = await Quiz.findById(req.params.quizId).populate("questions");
            return res.status(200).json({
                message: 'Quiz questions retrieved from the database.',
                quiz,
                questions
            });
        } else {
            return res.status(401).json({
                message: 'You are not authorized to do this action.'
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving quiz questions.",
            error: error.message
        });
    }
}


// view all the quiz 
exports.viewAllQuiz = async (req, res) => {
    try {
        const id = req.user;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);
        if(userStatus.roles === "admin" || userStatus.roles === "student") {
            const quizzes = await Quiz.find();
            return res.status(200).json({
                message: 'Quizs retrieved from the database.',
                quizzes
            });
        } else {
            return res.status(401).json({
                message: 'You are not authorized to do this action.'
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Error retrieving quiz.',
            error: error.message
        });
    }
}

// from question id, get all the answers for that question
exports.getQuizAnswers = async (req, res) => {
    try {
        const id = req.user;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);
        if(userStatus.roles === "admin" || userStatus.roles === "student") {
            const answers = await Question.find(req.params.questionId, "correct_answer_index" );            
            return res.status(200).json({
                message: 'Quiz questions retrieved from the database.',
                answers,
            });
        } else {
            return res.status(401).json({
                message: 'You are not authorized to do this action.'
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Error retrieving questions.',
            error: error.message
        });
    }
}


exports.getQuizScore = async (req, res) => {
    try {
        const id = req.user;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);
        if(userStatus.roles === "admin" || userStatus.roles === "student") {
            const submittedAnswerIds = req.body;
            const quiz = await Quiz.findById(req.params.quizId);
            const score = await Submission.find({userId: id, quizId: req.params.quizId}).reduce((score, submission) => {
                const submittedAnswerIds = submission.answers.map((answer) => answer.id);
                return score + (submittedAnswerIds.includes(submission.score)? 1 : 0);
            }, 0);
            return res.status(200).json({
                message: 'Quiz score retrieved from the database.',
                score,
            });
        } else {
            return res.status(401).json({
                message: 'You are not authorized to do this action.'
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Error retrieving quiz score.',
            error: error.message
        });
    }
}



// Route to receive user submissions and calculate the score
exports.createSubmitAnswer = async (req, res) => {
  const { userAnswers } = req.body; 
  const quizId = req.params.quizId;
  const id = req.user;
  let score = 0;

  try {
    for (const userAnswer of userAnswers) {
      const question = await Question.findById(quizId, "options");
      if (userAnswer.isCorrect === question.isCorrect) {
        score++;
      } 
    }
    // update user's score  
    const user = await User.findById(id);
    await User.findByIdAndUpdate(user._id, {
      $inc: {score: +score},
    },
    {
      new: true
    });
      const submission = new Submission({
        userId: req.user,
        quizId: req.params.quizId,
        answers: userAnswers,
        score,
      });
      await submission.save();
      return res.status(200).json({ message: "quiz submitted successfully", score, submission});    
  } catch (err) {
    return res
     .status(500)
     .send({
        message: "Internal server error while submitting quiz",
        error: err.message,
      });
  }
};

// Route to get all the questions for a quiz
exports.getQuestionAnswers = async (req, res) => {
  try {
    const id = req.user;
    const user = await User.findById(id);
    const userStatus = await User.findById(user._id);
    if(userStatus.roles === "admin" || userStatus.roles === "student") {
        const questions = await Question.find({})
        .populate("answers")
        .exec();
        return res.status(200).json({
            message: 'Quiz questions retrieved from the database.',
            questions: questions.map((question) => {
                return {
                   ...question.toObject(),
                    answers: question.answers.map((answer) => {
                        return {
                           ...answer.toObject(),
                            selected_answer_index: answer.isCorrect,
                        };
                    }), 
                };
            }),
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
};


// delete all the questions 
exports.deleteAllQuestions = async (req, res) => {
  try {
    const id = req.user;
    const user = await User.findById(id);
    const userStatus = await User.findById(user._id);
    if(userStatus.roles === "admin" || userStatus.roles === "student") {
      const questions = await Question.find({});
      await questions.forEach(async (question) => {
        await question.remove();
      });
      return res.status(200).json({ message: "all questions deleted successfully" });
    } else {
      return res.status(401).json({
        message: 'You are not authorized to do this action.'
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: 'Error deleting quiz questions.',
      error: error.message
    });
  }
};