const User = require('../models/user.model');
const Course = require('../models/course.model');
const StudentCourse = require('../models/student.model')
const Transaction = require('../models/transaction.model');

// // GET A SINGLE COURSE BY ID
// exports.getCourse = asyncHandler(async (req, res) => {
//   const id = req.params.id;
//   const course = await Student.findById(id).populate('user', 'name email');

//   if (course) {
//     res.json(course);
//   } else {
//     res.status(404);
//     throw new Error('Order Not Found!');
//   }
// });

// // TO ENROL A COURSE
// exports.createCourse = asyncHandler(async (req, res) => {
//   const { orderCourses, description, price, paymentMethod } = req.body;

//   if (orderCourses && orderCourses.length === 0) {
//     res.status(400);
//     throw new Error('You are presently not enrolled for any course yet');
//   } else {
//     const course = new Student({
//       orderCourses,
//       user: req.user_id,
//       price,
//       description,
//       paymentMethod,
//       totalprice,
//     });

//     const createdCourse = await course.save();
//     res.status(201).json(createdCourse);
//   }
// });

// // STUDENT LOGIN COURSES
// const studentLoginCourse = asyncHandler(async (req, res) => {
//   const courses = await Student.find({ user: req.user.id }).sort({ id: -1 });

//   res.json(courses);
// });

// // COURSE IS PAID
// exports.paidCourse = asyncHandler(async (req, res) => {
//   const { id, status, update_time, email_address } = req.body;
//   const course = await Student.findById(req.params.id);

//   if (course) {
//     course.isPaid = true;
//     course.paidAt = Date.now();
//     course.paymentResult = {
//       id: id,
//       status: status,
//       update_time: update_time,
//       email_address: email_address,
//     };

//     const updatedCourse = await course.save();
//     res.json(updatedCourse);
//   } else {
//     res.status(404);
//     throw new Error('Order Not Found!');
//   }
// });






// student register for course

exports.studentRegisterCourse = async(req, res) => {
    try {
        const id = req.user;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);
        if(userStatus.roles === 'student') {
          if( userStatus.courseLimit === 3) {
            return res.status(400).json({
              message: 'You have reached your limit of 3 courses'
            });
          };
        const courseId  = req.params.courseId;  
        const course = await Course.findById(courseId);
        const newCourse = await StudentCourse.create({
            courseId: course._id,
            title: course.title,
            price: course.price,
            category: course.category,
            userId: userStatus._id
        });
        // update the user courseLimit
        const updatedUser = await User.findByIdAndUpdate(userStatus._id, {
            courseLimit: userStatus.courseLimit + 1
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
        if(userStatus.roles === 'admin') {
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


// student delete his registered course

exports.studentDeleteCourse = async(req, res) => {
    try {
        const id = req.user;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);
        if(userStatus.roles === 'admin') {
            const course = await StudentCourse.findOneAndDelete(req.params.courseId);
            return res.status(200).json({
                message: 'Course deleted successfully',
                course
        });
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
        if(userStatus.roles === 'admin') {
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
        if(userStatus.roles === 'student') {
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