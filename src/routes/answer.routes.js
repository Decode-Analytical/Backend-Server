const express = require('express');
const { auth } = require('../middleware/auth');
const router = express.Router();
const { studentAnswerQuestions, studentViewAnswers } = require('../controllers/answer.controller');


router.use(auth);
router.post('/answerQuestion/:questionId', studentAnswerQuestions);
router.get('/viewAnswer', studentViewAnswers);


module.exports = router;