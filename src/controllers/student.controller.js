const User = require('../models/user.model');
const { Course } = require('../models/course.model');
const StudentCourse = require('../models/student.model')
const Transaction = require('../models/transaction.model');



// student register for course

exports.studentRegisterCourse = async(req, res, next) => {
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
        if(userStatus.roles === 'student' || userStatus.roles === 'IT' || userStatus.roles === 'admin') {
          if( userStatus.courseLimit === 10) {
            return res.status(400).json({
              message: 'You have reached your limit of 10 courses'
            });
          };

          // link for href
          const link = `https://decode-mnjh.onrender.com/api/payment/initializePayment/?courseId=${courseId}`;
           
        if(course.isPaid_course === 'paid' ){
            return res.status(401).json({message: `pls, kindly click on the ${link} to pay for this course`})
        }
       
        const newCourse = await StudentCourse.create({
            courseId: course._id,
            title: course.course_title,
            description: course.course_description,
            image: course.course_image,
            audio: course.audio,
            price: course.isPrice_course === 'free'? course.isPaid_course : 0,
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


// student update his profile

exports.studentUpdateProfile = async(req, res) => {
    try {
        const id = req.user;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);
        if(userStatus.roles ==='student' || userStatus.roles === 'IT') {
            const userUpdate = await User.findOneAndUpdate({ userId: userStatus._id }, {
                $set: {
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    phoneNumber: req.body.phoneNumber,
                    address: req.body.address,
                }
            }, {
                new: true
            });
            return res.status(200).json({
                message: 'Profile updated successfully',
                userUpdate
        });
    }else{
        return res.status(400).json({
            message: 'You must be registered student to update your profile'
        });
    }
    }catch(error) {
        return res.status(400).json({
            message: 'Error while updating profile',
            error: error.message
        });
    }
};

// student update his password

exports.studentUpdatePassword = async(req, res) => {
    try {
        const id = req.user;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);
        if(userStatus.roles ==='student' || userStatus.roles === 'IT') {
            const userUpdate = await User.findOneAndUpdate({ userId: userStatus._id }, {
                $set: {
                    password: req.body.password,
                }
            }, {
                new: true
            });
            return res.status(200).json({
                message: 'Password updated successfully',
                userUpdate
        });
    }else{
        return res.status(400).json({
            message: 'You must be registered student to update your password'
        });
    }
    }catch(error) {
        return res.status(400).json({
            message: 'Error while updating password',
            error: error.message
        });
    }
};

// student update his role

exports.studentUpdateRole = async(req, res) => {
    try {
        const id = req.user;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);
        if(userStatus.roles ==='student' || userStatus.roles === 'IT' || userStatus.roles === 'admin') {
            const userUpdate = await User.findOneAndUpdate({ userId: userStatus._id }, {
                $set: {
                    roles: req.body.roles,
                }
            }, {
                new: true
            });
            return res.status(200).json({
                message: 'Role updated successfully',
                userUpdate
        });
    }else{
        return res.status(400).json({
            message: 'You must be registered student to update your role'
        });
    }
    }catch(error) {
        return res.status(400).json({
            message: 'Error while updating role',
            error: error.message
        });
    }
};


// count the total number of students registered 

exports.studentCount = async(req, res) => {
    try {
        const id = req.user;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);
        if(userStatus.roles ==='student' || userStatus.roles === 'IT' || userStatus.roles === 'admin') {
            const count = await StudentCourse.find({ }).count();
            return res.status(200).json({
                message: 'Total number of students registered fetched successfully',
                count
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

// count the total number of students paid for his registered course

exports.studentPaidCount = async(req, res) => {
    try {
        const id = req.user;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);
        if(userStatus.roles ==='student' || userStatus.roles === 'IT' || userStatus.roles === 'admin') {
            const count = await Transaction.find({ userId: userStatus._id }).count();
            return res.status(200).json({
                message: 'Total number of students paid for his registered course fetched successfully',
                count
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

// count the total number of students registered in a specific course

exports.studentCourseCount = async(req, res) => {
    try {
        const id = req.user;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);
        if(userStatus.roles ==='student' || userStatus.roles === 'IT' || userStatus.roles === 'admin') {
            const courseId = req.params.courseId;
            const count = await StudentCourse.find({ courseId: courseId }).count();
            return res.status(200).json({
                message: 'Total number of students registered in a specific course fetched successfully',
                count
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

// student update only the picture of his profile 

exports.studentUpdateProfilePicture = async(req, res) => {
    try {
        const id = req.user;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);
        if(userStatus.roles ==='student' || userStatus.roles === 'IT') {
            if(req.file){
                const picture = req.file.picture;        
            const userUpdate = await User.findOneAndUpdate({ userId: userStatus._id }, {
                $set: {
                    picture: picture,
                }
            }, {
                new: true
            });
        }
            return res.status(200).json({
                message: 'Profile picture updated successfully',
        });
    }else{
        return res.status(400).json({
            message: 'You must be registered student to update your profile picture'
        });
    }
    }catch(error) {
        return res.status(400).json({
            message: 'Error while updating profile picture',
            error: error.message
        });
    }
};










// course skill level (beginner, immediate, pro ) 

exports.courseSkillLevel = async(req, res) => {
    try {
        const id = req.user;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);
        if(userStatus.roles ==='student' || userStatus.roles === 'IT') {
            const courseId = req.params.courseId;
            const skillLevel = await CourseSkillLevel.find({ courseId: courseId }).count();
            return res.status(200).json({
                message: 'Total number of students paid for his registered course fetched successfully',
                skillLevel
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