const Course = require('../models/course.model');
const Comment = require("../models/comment.model");
const jwt = require("jsonwebtoken");

// endpoint to make a comment on a course
exports.addComment = async (req, res) => {
  try {
    const { commentBy, commentBody } = req.body;
    const course = req.course; //passed by the fetch course middleware
    const newComment = { commentBody, courseId: course._id, commentBy };

    await Comment.create({ ...newComment }); //create a new comment
    course.comment_count += 1; //increment the comment count for the course

    await course.save({ new: true });
    return res
      .status(200)
      .json({ message: "Comment added successfully", course });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};

/**Get some comments of a course sorted by time created */
exports.getComments = async (req, res) => {
    try {
      const {commentId} = req.params;
      const {limit} = req.query || 6 //to specify the total number of comments to return
        const course = req.course;
        limit = limit * 1;
        const latestComments = await Comment.find({})
          .sort({ timestamp: "desc" })
          .limit(10); //converted to number
        if (latestComments.length < 1) {
          return res
            .status(200)
            .json({
              message: " no comment available for this course at the moment",
            });
        }  
      return res
        .status(200)
        .json({ message: "Comment deleted successfully", course, latestComments });
      
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
        .json({ message: "Comment added successfully", course, comment });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: error.message });
    }
  };

  /**update a commentBody */
  exports.updateComment = async (req, res) => {
    try {
      const { commentBody } = req.body;
      const course = req.course; //passed by the fetch course middleware
      
      const updatedComment = await Comment.findByIdAndUpdate(req.params.commentId,commentBody );
      if(!updatedComment) {
        return res
        .status(404)
        .json({message: " comment not found"})
      }
      return res
        .status(200)
        .json({ message: "Comment updated successfully", course, updatedComment });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: error.message });
    }
  };  

  /**update a commentBody */
  exports.deleteComment = async (req, res) => {
    try {
      const course = req.course; //passed by the fetchCourse middleware      
      const comment = await Comment.findByIdAndDelete(req.params.commentId,commentBody );
      const latestComments = await Comment.find()
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

// endpoint to get comments of a post
exports.getComment = ( async (req, res) => {
    const {token, course_id, pagec} = req.body;

    if(!token || !course_id || !pagec){
        return res.status(400).send({status: 'error', msg: 'All fields must be filled'});
    }

    try{
        let user = jwt.verify(token, process.env.JWT_SECRET);

        const resultsPerPage = 2;
        let page = pagec >= 1 ? pagec : 1;
        page = page -1;

        const comments = await Comment.find({course_id})
        .sort({timestamp: 'desc'})
        .limit(resultsPerPage)
        .skip(resultsPerPage * page)
        .lean();

        return res.status(200).send({status: 'ok', msg: 'Success', comments});
    }catch(e){
        console.log(e);
        return res.status({status: 'error', msg: 'An error occured'});
    }
});

// endpoint to delete a comment
exports.deleteComment = ( async (req, res) => {
    const { token, _id, course_id } = req.body;
    if(!token || !_id || !course_id)
      return res.status(400).send({status: 'error', msg: 'All fields must be filled'});
      
    try{
        let user = jwt.verify(token, process.env.JWT_SECRET);

        const comment = await Comment.findOneAndDelete({_id});
        if(!comment)
          return res.status(400).send({status: 'error', msg: 'Comment not found'});

        const course = await Course.findOneAndUpdate(
            {_id: course_id},
            {'$inc': {comment_count: -1}},
            {new: true}
        ).lean();

        return res.status(200).send({status: 'ok', msg: 'Comment deleted successfully', course});
    }catch(e){
        console.log(e);
        return res.status(400).send({status: 'error', msg: 'Some error occurred'});
    }
});


exports.editComment = (async (req, res) => {
    const { token, _id, comment_body } = req.body;

    if(!token || !_id)
      return res.status(400).send({status: 'error', msg: 'All fields must be filled'});

    try{
        const user = jwt.verify(token, process.env.JWT_SECRET);
        console.log("dee")
        const filter = {_id: _id};
        const comments = {comment: comment_body || comment.comment}

        let comment = await Comment.findByIdAndUpdate(filter, comments, {
            new: true
        });
    
        if(!comment) 
          return res.status(404).send({status: 'ENOENT', msg: 'Comment not found'});
    
        return res.status(200).send({status: 'ok', msg: 'Comment updated successfully', comment});
    }catch(e) {
         console.log(e);
        return res.status(400).send({status: 'error', msg: 'Some error occurred'})
    }
});


exports.replyComment = ( async (req, res) => {
    const { _id, token, comment_body, owner_img, owner_name} = req.body;

    if(!_id || !token)
      return res.status(400).send({status: 'error', msg: 'All fields must be filled'});

    try{
        const user = jwt.verify(token, process.env.JWT_SECRET);

        let comment = await Comment.findByIdAndUpdate(
            {_id},
            {'$inc': {reply_count: +1}},
            {new: true}
        ).lean();
        
        comment = await new Comment;
        comment.comment = comment_body;
        comment.comment_id = _id;
        comment.owner_id = user._id;
        comment.owner_name = owner_name;
        comment.owner_img = owner_img || '';

        comment = await comment.save();
        return res.status(200).send({status: 'ok', msg: 'Success', comment});
        
    }catch(e) {
        console.log(e);
        return res.status(400).send({status: 'error', msg: 'Some error occurred', e});
    }
});