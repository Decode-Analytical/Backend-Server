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
   
    const newComment = await Comment.create({ commentBody, courseId: course._id, commentBy })//create a new comment
    //increment the comment count for the course and add the Id to the course comment list
    await Course.findByIdAndUpdate(courseId, 
      {
        $inc: { comment_count: 1 },
        $push: { comments:   newComment._id  },
      },
      { new: true }
    )

    return res
      .status(200)
      .json({ message: "Comment added successfully", newComment, course});
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};

/**Get some comments of a course sorted by time created */
exports.getCourseComments = async (req, res) => {
    try {
      const {courseId} = req.params
    
      const course = await Course.findById( courseId, "comments comment_count"  );
      if (!course) {
        return res.status(404).json({ message: "course not found"});
      }

      let limit = req.query.limit  //to specify the total number of comments to return
        limit = limit * 1; //convert the string to a number
        if(!limit){
            limit = 4 //if limit is not specified then limit will be 4
        }
        
        const latestComments = await Comment.find({courseId: course._id})
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
        .json({  course, latestComments });
      
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

    if(!comment.parentCommentId){ // if the comment is not a reply, we will decrement the comment count for the comment
      await Course.findByIdAndUpdate(comment.courseId, 
        {
          $inc: { comment_count: -1 },
          $pull : { comments:   commentId} 
        }, 
  
        { new: true }
        )
    }

    return res
      .status(200)
      .json({
        status: "success",
        message: "Comment deleted successfully, all replies are deleted too",
      });
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
      const userId = req.user._id;

      const parentComment = await Comment.findById(parentCommentId, 
       "_id reply_count like_count dislike_count commentReplies courseId parentCommentId"
        );
      if (!parentComment) {
        return res
          .status(404)
          .json({ error: " comment not found to reply to" });
      }

      //check if the student exist and he registered for the course
      const student = await Student.find({ userId , courseId: parentComment.courseId });
      if (!student) {
        return res.status(401).json({
          error: `please register so you can comment the course`,
        });
      }

      const commentBy = userId;
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
            $push: { commentReplies : commentReply._id } },
          {
            new: true,
            _id: 1,
            reply_count: 1,
            like_count: 1,
            dislike_count: 1,
            commentReplies: 1,
          }
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

  /**Get a particular comment by id */
exports.getCommentReplies = async (req, res) => {
  try {
    let limit = req.query.limit  //to specify the total number of comments to return
    limit = limit * 1; //convert the string to a number
    if(!limit){
        limit = 4 //if limit is not specified then limit will be 4
    } 
    const {commentId} = req.params;
    const totalReply = await Comment.findById(commentId , {reply_count: 1, _id: 0});
    const latestComments = await Comment.find({parentCommentId: commentId })
    .limit(limit)
    .sort({createdAt: -1})

    if (!latestComments || latestComments.length < 1) {
      return res.status(404).json({ error: " latestComments  found or replies not found" });
    }
    return res
      .status(200)
      .json({ message: "success", totalReply: totalReply.reply_count , latestComments });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.message });
  }
};





