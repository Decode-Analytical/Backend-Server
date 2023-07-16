const express = require("express");
const {auth} = require("../middleware/auth");
const likeController = require('../controllers/like.controller');
const likeRouter = express.Router();

// likeCourse
likeRouter.get('/random', likeController.test)

// likeRouter.use(auth);
likeRouter.put('/:courseId/:studentId/like', likeController.likeCourse)
likeRouter.put('/:courseId/:studentId/dislike', likeController.dislikeCourse)

module.exports = likeRouter;