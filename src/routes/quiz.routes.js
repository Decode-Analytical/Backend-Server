const express = require('express');
const { auth } = require('../middleware/auth')
const router = express.Router();
const {
  getQuizQuestions,
  getQuizQuestionsById,
  createQuizQuestions,
  updateQuizQuestions,
  deleteQuizQuestions,
  createQuiz,
  createQuizWithQuestions,
  getQuizById,
  submitQuiz,
  getQuizSubmittedById,
  getQuizQuestionId,
  viewAllQuiz,
  getQuizAnswers,
} = require("../controllers/quiz.controller");

router.use(auth);
router.get('/getAllQuizzes', getQuizQuestions);
router.get('/viewQuestion/:id', getQuizQuestionsById);
router.post('/createQuiz/:moduleId', createQuizQuestions);
router.put('/updateQuiz/:id', updateQuizQuestions);
router.delete('/deleteQuiz/:id', deleteQuizQuestions);
router.post('/createQuiz/:moduleId', createQuiz)
router.post('/createQuestion/:moduleId/questions', createQuizWithQuestions)
router.get('/getQuiz/:quizId', getQuizById)
router.post('/submitQuiz/:quizId/submit', submitQuiz)
router.get('/submit/:submitId', getQuizSubmittedById)
router.get('/questionId/:quizId', getQuizQuestionId)
router.get('/viewAllTheQuiz', viewAllQuiz)
router.get('/viewAllTheQuestion/:moduleId', getQuizAnswers)

module.exports = router;