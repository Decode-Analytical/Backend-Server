const Course = require('../models/course.model');
const Comment = require("../models/comment.model");
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
    const { commentBy } = req.body;
    const {commentBody} = validation.value
    const course = req.course; //passed by the fetch course middleware
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
exports.getComments = async (req, res) => {
    try {
      let limit = req.query.limit  //to specify the total number of comments to return
        const course = req.course;
        limit = limit * 1; //convert the string to a number
        if(!limit){
            limit = 4
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
      res.status(500).send({ message: error.message });
    }
  };

/**Get a particular comment by id */
exports.getCommentById = async (req, res) => {
    try {
      const {commentId} = req.params;
      const course = req.course; //passed by the fetch course middleware 
      const comment = await Comment.findById(commentId);
      if(!comment) {
        return res
        .status(404)
        .json({message: " comment not found"})
      }
      return res
        .status(200)
        .json({ message: "success", course, comment });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: error.message });
    }
  };

  /**update a commentBody */ //NOT YET TESTED FULLY
  exports.updateComment = async (req, res) => {
    try {
      const validation = validatedCommentSchema(req.body);
      if (validation.error) {
        res.status(422).send(validation.error.details[0].message);
        return;
      }
      const { commentBy } = req.body;
      const {commentId} = req.param;
      const {commentBody} = validation.value
      const comment = await Comment.findById(commentId)
      if(!comment) {
        return res
        .status(404)
        .json({message: " comment not found"})
      }
      if(commentBy.toString() ===  comment.commentBy.toString()) { //another user trying to update the comment
        return res
        .status(401)
        .json({message: "user not allowed to edit comment"})
      }
      const updatedComment = await Comment.findByIdAndUpdate(req.params.commentId,commentBody );
      const course = req.course; //passed by the fetch course middleware
      return res
        .status(200)
        .json({ message: "Comment updated successfully", course, updatedComment });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: error.message });
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
      const parentComment = await Comment.findByIdAndUpdate(
        parentCommentId,
        (parentComment.reply_count += 1),
        { new: true }
      );
      if (!parentComment) {
        return res
          .status(404)
          .json({ message: " comment not found to reply to" });
      }
      const course = req.course; //passed by the fetch course middleware
      const { commentBy } = req.body;

      const reply = {
        commentBody,
        courseId: course._id,
        commentBy,
        parentCommentId,
      };

      const commentReply = await Comment.create({ ...reply }); //create a new comment
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
  
  /**Delete a comment */ //NEEDED TO DELETE ALL CHILDREN COMMENTS
  exports.deleteComment = async (req, res) => {
    try {
      const course = req.course; //passed by the fetchCourse middleware      
      const comment = await Comment.findByIdAndDelete(req.params.commentId );

      const latestComments = await Comment.find({})
      .sort({ createdAt: -1 })
      .limit(5); 
      if(!comment) {
        return res
        .status(404)
        .json({message: " comment not found"})
      }
      course.comment_count -= 1; //decrement the comment count for the course
      await course.save({ new: true });
      return res
        .status(200)
        .json({ message: "Comment deleted successfully", course, latestComments });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: error.message });
    }
  };  

   /**Delete a child comment */
   exports.deleteCommentReply = async (req, res) => {
    try {
      const comment = await Comment.findByIdAndDelete(req.params.commentId );
      const parentCommentId = req.params.commentId;
      const parentComment = await Comment.findByIdAndUpdate(
        parentCommentId,
        (parentComment.reply_count -= 1), //reduce the reply count by 1
        { new: true }
      );
      if (!parentComment) {
        return res
          .status(404)
          .json({ message: " comment not found to reply to" });
      }
      const course = req.course; //passed by the fetch course middleware
      const latestComments = await Comment.find({}) //returns the latest comments
      .sort({ createdAt: -1 })
      .limit(5); 
      if(!comment) {
        return res
        .status(404)
        .json({message: " comment not found"})
      }
      return res
        .status(200)
        .json({ message: "reply deleted successfully", course, latestComments });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: error.message });
    }
  };  

// // endpoint to get comments of a post
// exports.getComment = ( async (req, res) => {
//     const {token, course_id, pagec} = req.body;

//     if(!token || !course_id || !pagec){
//         return res.status(400).send({status: 'error', msg: 'All fields must be filled'});
//     }

//     try{
//         let user = jwt.verify(token, process.env.JWT_SECRET);

//         const resultsPerPage = 2;
//         let page = pagec >= 1 ? pagec : 1;
//         page = page -1;

//         const comments = await Comment.find({course_id})
//         .sort({timestamp: 'desc'})
//         .limit(resultsPerPage)
//         .skip(resultsPerPage * page)
//         .lean();

//         return res.status(200).send({status: 'ok', msg: 'Success', comments});
//     }catch(e){
//         console.log(e);
//         return res.status({status: 'error', msg: 'An error occured'});
//     }
// });

// // endpoint to delete a comment
// exports.deleteComment = ( async (req, res) => {
//     const { token, _id, course_id } = req.body;
//     if(!token || !_id || !course_id)
//       return res.status(400).send({status: 'error', msg: 'All fields must be filled'});
      
//     try{
//         let user = jwt.verify(token, process.env.JWT_SECRET);

//         const comment = await Comment.findOneAndDelete({_id});
//         if(!comment)
//           return res.status(400).send({status: 'error', msg: 'Comment not found'});

//         const course = await Course.findOneAndUpdate(
//             {_id: course_id},
//             {'$inc': {comment_count: -1}},
//             {new: true}
//         ).lean();

//         return res.status(200).send({status: 'ok', msg: 'Comment deleted successfully', course});
//     }catch(e){
//         console.log(e);
//         return res.status(400).send({status: 'error', msg: 'Some error occurred'});
//     }
// });


// exports.editComment = (async (req, res) => {
//     const { token, _id, comment_body } = req.body;

//     if(!token || !_id)
//       return res.status(400).send({status: 'error', msg: 'All fields must be filled'});

//     try{
//         const user = jwt.verify(token, process.env.JWT_SECRET);
//         console.log("dee")
//         const filter = {_id: _id};
//         const comments = {comment: comment_body || comment.comment}

//         let comment = await Comment.findByIdAndUpdate(filter, comments, {
//             new: true
//         });
    
//         if(!comment) 
//           return res.status(404).send({status: 'ENOENT', msg: 'Comment not found'});
    
//         return res.status(200).send({status: 'ok', msg: 'Comment updated successfully', comment});
//     }catch(e) {
//          console.log(e);
//         return res.status(400).send({status: 'error', msg: 'Some error occurred'})
//     }
// });


// exports.replyComment = ( async (req, res) => {
//     const { _id, token, comment_body, owner_img, owner_name} = req.body;

//     if(!_id || !token)
//       return res.status(400).send({status: 'error', msg: 'All fields must be filled'});

//     try{
//         const user = jwt.verify(token, process.env.JWT_SECRET);

//         let comment = await Comment.findByIdAndUpdate(
//             {_id},
//             {'$inc': {reply_count: +1}},
//             {new: true}
//         ).lean();
        
//         comment = await new Comment;
//         comment.comment = comment_body;
//         comment.comment_id = _id;
//         comment.owner_id = user._id;
//         comment.owner_name = owner_name;
//         comment.owner_img = owner_img || '';

//         comment = await comment.save();
//         return res.status(200).send({status: 'ok', msg: 'Success', comment});
        
//     }catch(e) {
//         console.log(e);
//         return res.status(400).send({status: 'error', msg: 'Some error occurred', e});
//     }
// });