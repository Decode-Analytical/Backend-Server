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
  getQuizById,
  submitQuiz,
  getQuizSubmission,
} = require("../controllers/quiz.controller");

router.use(auth);
router.get('/getAllQuizzes', getQuizQuestions);
router.get('/viewQuestion/:id', getQuizQuestionsById);
router.post('/createQuiz/:moduleId', createQuizQuestions);
router.put('/updateQuiz/:id', updateQuizQuestions);
router.delete('/deleteQuiz/:id', deleteQuizQuestions);
router.post('/:moduleId', createQuiz)
router.get('/:quizId', getQuizById)

module.exports = router;