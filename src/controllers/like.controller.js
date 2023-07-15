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
      const { courseId, studentId, like, userId } = req.body;

      const course = await Course.findById(courseId); //fetch the course to like
      if (!course) {
        return res.status(404).json({ message: "course not found" });
      }
      //check if the student exist and he registered for the course
      const student = await Student.findOne({
        userId,
        registeredCourses: { $elemMatch: { _id: courseId } },
      });
      //   console.log({student})

      if (!student) {
        return res.status(401).json({
          message: `user with the id: ${userId} has not been registered for this course`,
        });
      }

      const likedValue = student.registeredCourses.find(
        (course) => course._id.toString() === courseId
      ).like;

      /**if student already like(i.e stu.regC.like = 1), he cannot like again 
         but he can like if he only unlike (i.e stu.regC.like = -1) 
         previously or hasn't liked at all (i.e stu.regC.like = 0) */
    //      const updatedStudent = await Student.findOneAndUpdate(
    //         {
    //           _id: studentId,
    //           "registeredCourses._id": courseId,
    //         },
    //         { $inc: { "registeredCourses.$.like": 0 } },
    //         { new: true }
    //       );
    //       course.like_count=0
    //     await course.save()
    //    return res.send({updatedStudent, course})
    //    return res.send({student, course})


      if (Number(like) > 0 && likedValue > 0) {//incase he want to like again after liking
        return res
          .status(409)
          .json({ message: "you can only have a like per course" });
      }
      if (Number(like) > likedValue && likedValue <= 0) { //he hasn't liked the course yet
        const updatedCourse = await Course.findByIdAndUpdate(
          courseId,
          { $inc: { like_count: 1 } },
          { new: true }
        );
        //update the student model
        await Student.findOneAndUpdate(
          {
            _id: studentId,
            "registeredCourses._id": courseId,
          },
          { $inc: { "registeredCourses.$.like": 1 } }
        );
        return res
          .status(200)
          .json({ message: "you like the course", updatedCourse });
      }
      res.status(409).send({ message: "conflicting request" });
     
    } catch (error) {
        console.error(error);
      res.status(500).send({ message: error.message });
    }
}

exports.test = async (req, res) => {
    

    if(req.query.c){
        const c = await Course.find({}, '_id title' )
    return res.status(200).send({ message: 'hello world from here', c });
    }
    const s = await Student.findOne().limit(1).populate('registeredCourses', 'like')
    s.registeredCourses.push("64b1c96f718f354f21c3a701")
    await s.save()
    res.status(200).send({ message: 'hello world from here', s });

    
}