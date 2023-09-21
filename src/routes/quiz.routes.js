const express = require('express');
const { auth } = require('../middleware/auth')
const router = express.Router();
const {
  getQuizQuestions,
  getQuizQuestionsById,
  createQuizQuestions,
  updateQuizQuestions,
  deleteQuizQuestions,
} = require('../controllers/quiz.controller');

router.use(auth);
router.get('/getAllQuizzes', getQuizQuestions);
router.get('/viewQuestion/:id', getQuizQuestionsById);
router.post('/createQuiz', createQuizQuestions);
router.put('/updateQuiz/:id', updateQuizQuestions);
router.delete('/deleteQuiz/:id', deleteQuizQuestions);


module.exports = router;