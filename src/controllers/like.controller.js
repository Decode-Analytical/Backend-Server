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

/**students can only like when they haven't like and they can't delete their like */
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

      if (likedValue > 0) {//incase he wants to like again after liking
        return res
          .status(409)
          .json({ message: "you can only have a like per course", student: student});
      }
      if (likedValue <= 0) { //he hasn't liked the course yet
        //increment the course like_count and save it
        course.like_count++; 
        course.save({ new: true })

        student.registeredCourses[registeredCourseIndex].like += 1
        student.save({ new: true })
        return res
          .status(200)
          .json({ message: "you like the course", course });
      }
      res.status(409).send({ message: "conflicting request" });
     
    } catch (error) {
        console.error(error);
      res.status(500).send({ message: error.message });
    }
}

/**students can only dislike when they haven't dislike and they can't delete their dislike */
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

    if (likedValue < 0) {//incase he wants to dislike again after disliking
      return res
        .status(409)
        .json({ message: "you can only dislike once"});
    }
    if (likedValue >= 0) { //he hasn't disliked the course yet
      //decrement the course like_count and save it
      course.like_count--; 
      course.save({ new: true })

      student.registeredCourses[registeredCourseIndex].like -= 1
      student.save({ new: true })
      return res
        .status(200)
        .json({ message: "you like the course", course });
    }
    res.status(409).send({ message: "conflicting request" });
   
  } catch (error) {
      console.error(error);
    res.status(500).send({ message: error.message });
  }
}


exports.test = async (req, res) => {
  return res.status(200).send({ message: 'hello world from here' });
    

    if(req.query.c){
        const c = await Course.find({}, '_id title' )
    return res.status(200).send({ message: 'hello world from here', c });
    }
    const s = await Student.findOne().limit(1).populate('registeredCourses', 'like')
    s.registeredCourses.push("64b1c96f718f354f21c3a701")
    await s.save()
    res.status(200).send({ message: 'hello world from here', s });

    
}