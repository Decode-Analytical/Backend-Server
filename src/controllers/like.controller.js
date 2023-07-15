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

//students can only like or dislike, they cant delete their like or dislike
exports.likeCourse = async (req, res) => {
    try {
      const { courseId, studentId, like } = req.body;

      const course = await Course.findById(courseId); //fetch the course to like
      if (!course) {
        return res.status(404).json({ message: "course not found" });
      }
      //check if the student exist and he registered for the course
      const student = (doesStudentRegistered = await Student.findOne(
        {
          _id: studentId,
          registeredCourses: { $in: [courseId] },
        },
        ""
      )); // return nothing
      if (!doesStudentRegistered) {
        return res.status(401).json({
          message: `student with the id: ${studentId} has not been registered for this course`,
        });
      }

      /**if student already like(i.e stu.regC.like = 1), he cannot like again 
         but he can like if he only unlike (i.e stu.regC.like = -1) 
         previously or hasn't liked at all (i.e stu.regC.like = 0) */

      if (Number(like) > 0 ) {
        if( student.registeredCourses.like > 0){ //incase he want to like again after liking
            return res.status(409).json({message: 'you can only have a like per course'});
        }
        //he has not liked at yet and want to like
        //increment the like by one and return the course
        const updatedCourse = await Course.findByIdAndUpdate(
          courseId,
          { $inc: { like_count: 1 } },
          { new: true }
        );
        return res
          .status(200)
          .json({ message: "course like successful", updatedCourse });
      }
      if (Number(like) < 1 && student.registeredCourses.like > -1) {
        //he has not dislike yet and want to
        return res
          .status(200)
          .json({ message: "you unlike the course", updatedCourse });
      }
      return res.status(409).json({message: 'you can only have a dislike per course'});

    } catch (error) {
      res.status(500).send({ message: error.message });
    }
}