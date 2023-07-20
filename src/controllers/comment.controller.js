const Comment = require("../models/comment.model");
const User = require("../models/user.model");
const Student = require('../models/student.model'); //needed to be able to authorize the the student to like the course
const Course = require('../models/course.model');
const jwt = require("jsonwebtoken");
const {validatedCommentSchema} = require('../utils/joiSchema')

/**  endpoint to make a comment on a course */
exports.addComment = async (req, res) => {
  try {
    const validation = validatedCommentSchema(req.body);
    if (validation.error) {
      res.status(422).send(validation.error.details[0].message);
      return;
    }
    const userId = commentBy = req.user._id;
    const { commentBody } = validation.value;
    const course = req.course; //passed by the fetch course middleware

    const courseId = course._id
    //check if the student exist and he registered for the course
    const student = await Student.find({ userId, courseId });
    if (!student) {
      return res.status(401).json({
        error: `please register so you can comment the course`,
      });
    }
   
    const newComment = { commentBody, courseId: course._id, commentBy };

    await Comment.create({ ...newComment }); //create a new comment
    course.comment_count += 1; //increment the comment count for the course

    await course.save({ new: true });
    return res
      .status(200)
      .json({ message: "Comment added successfully", course, newComment });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};

/**Get some comments of a course sorted by time created */
exports.getCourseComments = async (req, res) => {
    try {
      let limit = req.query.limit  //to specify the total number of comments to return
        limit = limit * 1; //convert the string to a number
        if(!limit){
            limit = 4 //if limit is not specified then limit will be 4
        }
        const latestComments = await Comment.find({})
          .sort({ createdAt: -1 })
          .limit(limit); //converted to number
        if (latestComments.length < 1) {
          return res
            .status(200)
            .json({
              message: " no comment available for this course at the moment",
            });
        }  
      return res
        .status(200)
        .json({  latestComments });
      
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: error.message });
    }
  };

/**Get a particular comment by id */
exports.getCommentById = async (req, res) => {
    try {
      const {commentId} = req.params;
      const comment = await Comment.findById(commentId);
      if(!comment) {
        return res
        .status(404)
        .json({message: " comment not found"})
      }
      return res
        .status(200)
        .json({ message: "success",  comment });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: error.message });
    }
  };

  /**update a commentBody */ //NOT YET TESTED FULLY
  exports.updateComment = async (req, res) => {
    try {
      const validation = validatedCommentSchema(req.body); //validating user input
      if (validation.error) {
        res.status(422).send(validation.error.details[0].message);
        return;
      }
      const commentBy = req.user._id
      const { commentId } = req.params;
      const { commentBody } = validation.value;
      const comment = await Comment.findById(commentId);
      if (!comment) {
        return res.status(404).json({ error: " comment not found" });
      }
        //check if another user trying to update the comment
      if (commentBy.toString() !== comment.commentBy.toString()) {
        return res
          .status(401)
          .json({ error: "cannot update another user comment" });
      }
      const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        {commentBody},
        { new: true }
      );
      return res
        .status(200)
        .json({ message: "Comment updated successfully", updatedComment });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: error.message });
    }
  };  

  /**Reply to comment. Comment with a parent comment */
  exports.replyComment = async (req, res) => {
    try {
      const validation = validatedCommentSchema(req.body);
      if (validation.error) {
        res.status(422).send(validation.error.details[0].message);
        return;
      }
      const { commentBody } = validation.value;
      const parentCommentId = req.params.commentId;
      const course = req.course; //passed by the fetch course middleware'
      //check if the student exist and he registered for the course
      const student = await Student.find({ userId, courseId });
      if (!student) {
        return res.status(401).json({
          error: `please register so you can comment the course`,
        });
      }

      const parentComment = await Comment.findById(parentCommentId);
      if (!parentComment) {
        return res
          .status(404)
          .json({ error: " comment not found to reply to" });
      }
      const commentBy = req.user._id;
      const reply = {
        commentBody,
        courseId: parentComment.courseId,
        commentBy,
        parentCommentId,
      };
      const commentReply = await Comment.create({ ...reply }); //create a new comment

      /**if the comment that want to reply to is also another reply to a comment, the new comment
      will be added to the reply list of the main comment. Otherwise we add the new comment as reply **/

      if (parentComment.parentCommentId) {
        //if the parentComment is also a reply to another comment
        const mainComment = await Comment.findByIdAndUpdate(
          parentComment.parentCommentId,
          {
            $inc: { reply_count: 1 },
            $push: { commentReplies: { commentReplies: commentReply._id } },
          },
          { new: true }
        );
        return res.status(200).json({
          message: "Comment reply added successfully to the main thread",
          mainComment,
          commentReply,
        });
      }
      //if the comment to reply has no parent
      parentComment.reply_count += 1; //increment the comment reply count
      parentComment.commentReplies.push(commentReply._id); // add the reply to the comment reply Id list

      await parentComment.save({ new: true }); // save and return the new comment

      return res.status(200).json({
        message: "Comment reply added successfully",
        parentComment,
        commentReply,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: error.message });
    }
  };
  
  /**Delete a comment */ 
  exports.deleteComment = async (req, res) => {
    try {
      const course = req.course; //passed by the fetchCourse middleware  
      const  commentBy  = req.user._id;
      const {commentId} = req.params;
      const comment = await Comment.findById(commentId)
      let limit = req.query.limit  //to specify the total number of comments to return
        limit = limit * 1; //convert the string to a number
        if(!limit) limit = 4; //if limit is not specified then limit will be 4
        
      if(!comment) {
        return res
        .status(404)
        .json({error: " comment not found"})
      }
      if(commentBy.toString() !==  comment.commentBy.toString()) { //another user trying to delete the comment
        return res
        .status(401)
        .json({error: "cannot delete another user comment"})
      }
      
    await Comment.deleteMany({ _id: { $in: comment.commentReplies } });// Delete all child comments (replies)
    await comment.remove(); //Delete the main comment

    course.comment_count -= 1; //decrement the comment count for the course
    await course.save({ new: true });
    const latestComments = await Comment.find({}) //comments to return
      .sort({ createdAt: -1 })
      .limit(limit);

    return res
      .status(200)
      .json({
        message: "Comment deleted successfully, all replies are deleted too",
        course,
        latestComments,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: error.message });
    }
  };  

   /**Delete a child comment */
   exports.deleteCommentReply = async (req, res) => {
    try {
        const {commentId} = req.params;
        const commentBy = req.user._id;
        let limit = req.query.limit  //to specify the total number of comments to return
        limit = limit * 1; //convert the string to a number
        if(!limit){
            limit = 4 //if limit is not specified then limit will be 4
        }
        const comment = await Comment.findById(commentId);
        if (!comment) {
          return res.status(404).json({ message: " comment not found" });
        }

        if (commentBy.toString() !== comment.commentBy.toString()) {
          //another user trying to delete the comment
          return res
            .status(401)
            .error({ error: "cannot delete another user comment" });
        }
      //decrement the parentComment reply count
        await Comment.findOneAndUpdate(
          { parentCommentId: comment.parentCommentId },
          {
            $inc: { reply_count: -1 }, 
            $pop: { commentReplies: { commentReplies: commentReply._id } },
          },
          { new: true }
        );
        
        const latestComments = await Comment.find({}) //returns the latest comments
          .sort({ createdAt: -1 })
          .limit(limit); 
     
      return res
        .status(200)
        .json({ message: "reply deleted successfully", latestComments });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: error.message });
    }
  };  




