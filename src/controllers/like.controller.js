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

exports.likeCourse = async (req, res) => {
    try{
        const {courseId, studentId} = req.body
        const course = await Course.findById(courseId); //fetch the course to like
        if(!course){
            return res.status(404).json({message: 'course not found'});
        }
        //check if the student exist and he registered for the course
        const doesStudentRegistered = await Student.findOne({
            _id: studentId,
            registeredCourses: { $in: [courseId] }
          }, '') // return nothing
          if(!doesStudentRegistered){
            return res.status(401).json({ message: `student with the id: ${studentId} has not been registered for this course`});
          }

        //if student already like, he cannot like again but if not, he can like

        //increment the like
        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            { $inc: { like_count: 1 } },
            { new: true }
          );

    }
    catch{}
}