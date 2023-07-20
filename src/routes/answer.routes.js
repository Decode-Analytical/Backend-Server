const express = require('express');
const { auth } = require('../middleware/auth');
const router = express.Router();
const { answerQuestion, studentViewAnswers } = require('../controllers/answer.controller');


router.use(auth);
router.post('/createAnswer', answerQuestion);
router.get('/viewAnswer', studentViewAnswers);


module.exports = router;