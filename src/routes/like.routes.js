const express = require("express");
const {auth} = require("../middleware/auth");
const likeController = require('../controllers/like.controller');
const likeRouter = express.Router();

// likeCourse
likeRouter.all('/:courseId/random', likeController.test)

// likeRouter.use(auth);
likeRouter.put('/:courseId/like', likeController.likeCourse)
likeRouter.put('/:courseId/dislike', likeController.dislikeCourse)

module.exports = likeRouter;