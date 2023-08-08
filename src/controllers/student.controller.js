const User = require('../models/user.model');
const Course = require('../models/course.model');
const StudentCourse = require('../models/student.model')
const Transaction = require('../models/transaction.model');



// student register for course

exports.studentRegisterCourse = async(req, res) => {
    try {
        const id = req.user;
        const user = await User.findById(id);
        const courseId  = req.params.courseId;  
        const course = await Course.findById(courseId);
        const hasStudentRegistered = await StudentCourse.findOne({userId: user._id, courseId})
        if (hasStudentRegistered){
            return res
            .status(409)
            .json({message: 'student already enrolled for this course'})
        }
        const userStatus = await User.findById(user._id);
        if(userStatus.roles === 'student' || userStatus.roles === 'IT') {
          if( userStatus.courseLimit === 3) {
            return res.status(400).json({
              message: 'You have reached your limit of 3 courses'
            });
          };
        // const courseId  = req.params.courseId;  
        // const course = await Course.findById(courseId);
        const newCourse = await StudentCourse.create({
            courseId: course._id,
            title: course.title,
            description: course.description,
            image: course.images,
            audio: course.audio,
            price: course.price,
            category: course.category,
            userId: userStatus._id
        });
        // update the user courseLimit
        const updatedUser = await User.findByIdAndUpdate({_id: userStatus._id}, {
            $inc: {courseLimit: + 1},
        },
        {
            new: true
        });
        return res.status(200).json({
            message: 'Course registered successfully',
            newCourse
        });
    }else{
        return res.status(400).json({
            message: 'You must be registered student to register course'
        });
    }
    } catch (error) {
        return res.status(400).json({
            message: 'Error while registering course',
            error: error.message
        });
    }
};


// student view his registered course

exports.studentViewCourse = async(req, res) => {
    try {
        const id = req.user;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);
        if(userStatus.roles === 'student' || userStatus.roles === 'IT') {
            const course = await StudentCourse.find({ userId: user._id });
            return res.status(200).json({
                message: 'Course registered fetched successfully',
                course
        });
    }else{
        return res.status(400).json({
            message: 'You must be registered student to view your course'
        });
    }
    } catch (error) {
        return res.status(400).json({
            message: 'Error while viewing user',
            error: error.message
        });
    }
};


// student view all registered courses

exports.studentViewAllCourse = async(req, res) => {
    try {
        const id = req.user;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);
        if(userStatus.roles === 'IT' || userStatus.roles === 'student') {
            const courses = await StudentCourse.find({ }).sort({ createdAt: -1 });
            return res.status(200).json({
                message: 'Course registered fetched successfully',
                courses
        });
    }else{
        return res.status(400).json({
            message: 'You must be registered student to view your course'
        });
    }
    } catch (error) {
        return res.status(400).json({
            message: 'Error while viewing user',
            error: error.message
        });
    }
};


// student delete his registered course

exports.studentDeleteCourse = async(req, res) => {
    try {
        const id = req.user;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);
        if(userStatus.roles === 'student' || userStatus.roles === 'IT') {
            const ownerId = await StudentCourse.findById(req.params.courseId);
            if(ownerId.userId === userStatus._id) {
                const course = await StudentCourse.findOneAndDelete(req.params.courseId);
                return res.status(200).json({
                    message: 'Course deleted successfully',
                    course
                });
            }else{
                return res.status(400).json({
                    message: 'You are not the owner of this course'
                });
            }
        }else{
            return res.status(400).json({
                message: 'You must be registered student to delete your course'
            });
        }
    } catch (error) {
        return res.status(400).json({
            message: 'Error while deleting course',
            error: error.message
        });
    }
};
  

// student view his paid registered course

exports.studentViewPaidCourse = async(req, res) => {
    try {
        const id = req.user;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);
        if(userStatus.roles === 'student' || userStatus.roles === 'IT') {
            const course = await Transaction.find({ userId: userStatus._id });
            return res.status(200).json({
                message: 'Course paid for fetched successfully',
                course
        });
    }else{
        return res.status(400).json({
            message: 'You must be registered student to view your course'
        });
    }
    } catch (error) {
        return res.status(400).json({
            message: 'Error while viewing user',
            error: error.message
        });
    }
};


// student update his status or role

exports.studentUpdateStatus = async(req, res) => {
    try {
        const id = req.user;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);
        if(userStatus.roles === 'student' || userStatus.roles === 'IT') {
            const course = await User.findOneAndUpdate({ userId: userStatus._id }, {
                $set: {
                    role: "IT",
                }
            }, {
                new: true
            });
            return res.status(200).json({
                message: 'Course status updated successfully',
                course
        });
    }else{
        return res.status(400).json({
            message: 'You must be registered student to update your course',
        });
    }
}catch(error) {
        return res.status(400).json({
            message: 'Error while updating course status',
            error: error.message
        });
    }
};

