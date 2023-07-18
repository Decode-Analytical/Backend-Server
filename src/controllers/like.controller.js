const Comment = require('../models/comment.model');
const Course = require('../models/course.model');
const User = require('../models/user.model');
const Student = require('../models/student.model'); //needed to be able to authorize the the student to like the course

// like a comment
exports.likeComment = async (req, res) => {
    try {
        const id = req.user;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);
        if (userStatus.roles === 'student') {
            return res.status(400).json({
                message: 'You can not like your own comment',
            });
        }
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return res.status(404).json({
                message: 'Comment not found',
            });
        }
        comment.likes.push(user._id);
        await comment.save();
        return res.status(200).json({
            message: 'Comment liked',
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Something went wrong',
        });
    }










    const { commentId } = req.params;
    const { userId } = req.user;
    const comment = await Comment.findById(commentId);
    if (!comment) {
        return res.status(404).json({
            message: 'Comment not found',
        });
    }
    if (comment.userId.toString() === userId.toString()) {
        return res.status(400).json({
            message: 'You can not like your own comment',
        });
    }
    comment.likes.push(userId);
    await comment.save();
    return res.status(200).json({
        message: 'Comment liked',
    });
};

/**students can only like when they haven't like or dislike and they can't delete their like */
exports.likeCourse = async (req, res) => {
    try {
      const { courseId, studentId } = req.params;

      const course = await Course.findById(courseId); //fetch the course to like
      if (!course) {
        return res.status(404).json({ message: "course not found" });
      }
      //check if the student exist and he registered for the course
      const student = await Student.findOne({
        _id: studentId,
        registeredCourses: { $elemMatch: { _id: courseId } },
      });

      if (!student) {
        return res.status(401).json({
          message: `student with the id: ${studentId} has not been registered for this course`,
        });
      }
      /**index of the course in the student registered course list */
      const registeredCourseIndex = student.registeredCourses.findIndex(course => course._id.toString() === courseId);        
      
      /**likedValue can be 1, 0 or -1. 1 for like, 0 for no decision yet and 0 for unlike */
      const likedValue = student.registeredCourses[registeredCourseIndex].like

      if (likedValue != 0) {//incase he wants to like again after like or dislike
        return res
          .status(409)
          .json({ message: "you can only like or dislike a course once"});
      }
      // if he hasn't liked or disliked the course yet, increment the course like_count and save it
        course.like_count++; 
        course.save({ new: true })

        student.registeredCourses[registeredCourseIndex].like = 1
        student.save({ new: true })
        return res
          .status(200)
          .json({ message: "you like the course", course });
     
    } catch (error) {
        console.error(error);
      res.status(500).send({ message: error.message });
    }
}

/**students can only dislike when they haven't like or dislike and they can't delete their dislike */
exports.dislikeCourse = async (req, res) => {
  try {
    const { courseId, studentId } = req.params;

    const course = await Course.findById(courseId); //fetch the course to like
    if (!course) {
      return res.status(404).json({ message: "course not found" });
    }
    //check if the student exist and he registered for the course
    const student = await Student.findOne({
      _id: studentId,
      registeredCourses: { $elemMatch: { _id: courseId } },
    });

    if (!student) {
      return res.status(401).json({
        message: `student with the id: ${studentId} has not been registered for this course`,
      });
    }
    /**index of the course in the student registered course list */
    const registeredCourseIndex = student.registeredCourses.findIndex(course => course._id.toString() === courseId);        
    
    /**likedValue can be 1, 0 or -1. 1 for like, 0 for no decision yet and 0 for unlike */
    const likedValue = student.registeredCourses[registeredCourseIndex].like

    if (likedValue != 0) {//incase he wants to dislike again after like or dislike
      return res
        .status(409)
        .json({ message: "you can only like or dislike once for a course"});
    }

    // if he hasn't like or disliked the course yet, increment the course dislike_count and save it
      course.dislike_count++; 
      course.save({ new: true })

      student.registeredCourses[registeredCourseIndex].like = -1
      student.save({ new: true })
      return res
        .status(200)
        .json({ message: "you dislike the course, you can watch again", course });
   
  } catch (error) {
      console.error(error);
    res.status(500).send({ message: error.message });
  }
}


exports.test = async (req, res) => {
  // return res.status(200).send({ message: 'hello world from here' });
    

  //   if(req.query.c){
  //       const c = await Course.find({}, '_id title' )
  //   return res.status(200).send({ message: 'hello world from here', c });
  //   }
    const s = await Student.find({}, '_id registeredCourses userId')
    // s.registeredCourses.push("64b1c96f718f354f21c3a701")
    // await s.save()
    res.status(200).send({ message: 'hello world from here', s });

    
}