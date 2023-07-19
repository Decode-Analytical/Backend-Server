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

    //check if the student exist and he registered for the course by checking his registered courses list
    const student = await Student.findOne({
      userId,
      registeredCourses: { $elemMatch: { _id: course._id } },
    });

    if (!student) {
      return res.status(401).json({
        error: `please register so you can like the course`,
      });
    }
    // /**index of the course in the student registered course list */
    // const registeredCourseIndex = student.registeredCourses.findIndex(courseObj => courseObj._id.toString() === course._id);        
    
    // /**commented can be true or false */
    // const commented = student.registeredCourses[registeredCourseIndex].commented

    // if (commented) {//incase he wants to comment again after comment
    //   return res
    //     .status(409)
    //     .json({ error: "you can only comment  a course once"});
    // }
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
      res.status(500).send({ message: error.message });
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
      const  commentBy  = req.user_id;
      const {commentId} = req.params;
      const {commentBody} = validation.value
      const comment = await Comment.findById(commentId)
      if(!comment) {
        return res
        .status(404)
        .json({error: " comment not found"})
      }
      if(commentBy.toString() ===  comment.commentBy.toString()) { //another user trying to update the comment
        return res
        .status(401)
        .json({error: "cannot update another user comment"})
      }

      const updatedComment = await Comment.findByIdAndUpdate(req.params.commentId,commentBody );
      const course = req.course; //passed by the fetch course middleware
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

      const parentComment = await Comment.findById(parentCommentId);
      if (!parentComment) {
        return res
          .status(404)
          .json({ error: " comment not found to reply to" });
      }
      const { commentBy } = req.user._id;
      const reply = {
        commentBody,
        courseId: course._id,
        commentBy,
        parentCommentId,
      };
      const commentReply = await Comment.create({ ...reply }); //create a new comment

      /**if the comment that want to reply to is also another reply to a comment, the new comment
      will be added to the reply list of the main comment. Otherwise we add the new comment as reply **/

      if (parentComment.parentCommentId){ //if the parentComment is also a reply to another comment
        const mainComment = await Comment.findByIdAndUpdate(
            parentComment.parentCommentId,
            {
                $inc: { reply_count: 1 },
                $push: { commentReplies: { commentReplies: commentReply._id } },
              },
              { new: true }
        )
        return res.status(200).json({
            message: "Comment reply added successfully to the main thread",
            mainComment,
            commentReply,
          });
      }
        //if the comment to reply has no parent       
        parentComment.reply_count +=1 //increment the comment reply count
        parentComment.commentReplies.push(commentReply._id); // add the reply to the comment reply Id list

        await parentComment.save({new: true}); // save and return the new comment
            
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
      if(!comment) {
        return res
        .status(404)
        .json({error: " comment not found"})
      }
      if(commentBy.toString() ===  comment.commentBy.toString()) { //another user trying to delete the comment
        return res
        .status(401)
        .error({message: "cannot delete another user comment"})
      }
      
    await Comment.deleteMany({ _id: { $in: comment.commentReplies } });// Delete all child comments (replies)
    await comment.remove(); //Delete the main comment

    course.comment_count -= 1; //decrement the comment count for the course
    await course.save({ new: true });
    const latestComments = await Comment.find({}) //comments to return
      .sort({ createdAt: -1 })
      .limit(5);

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
        const comment = await Comment.findById(commentId);
        if (!comment) {
          return res.status(404).json({ message: " comment not found" });
        }

        if (commentBy.toString() === comment.commentBy.toString()) {
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
          .limit(5); 
     
      return res
        .status(200)
        .json({ message: "reply deleted successfully", latestComments });
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
