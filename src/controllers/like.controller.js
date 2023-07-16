const Course = require('../models/course.model');
const User = require('../models/user.model');


exports.likeCourse = async (req, res) => {
    try {
        const id = req.user;
        const existingUser = await User.findById(id);
        const userStatus = await User.findById(existingUser._id);
        if (userStatus.roles === 'admin' && userStatus.roles === 'student' && userStatus.roles === 'IT') {
        const _id = req.body._id;
        const course = await Course.findById( _id );        
        if (course) {
            await Course.findOneAndUpdate({ _id: course._id }, { $inc: { like_count: 1 } });
            return res.status(200).json({
                message: 'Like added successfully',
                course                    
                });
            } else {
                return res.status(400).json({
                    message: 'you are not allowed to like this course'
                });  
            } 
        }                
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};
        

exports.unlikeCourse = async (req, res) => {
    try {
        const id = req.user;
        const existingUser = await User.findById(id);
        const userStatus = await User.findById(existingUser._id);
        if (userStatus.roles === 'admin' && userStatus.roles === 'student' && userStatus.roles === 'IT') {
        const { _id } = req.body;
        const course = await Course.findById( _id );
        if(course){
            await Course.findOneAndUpdate({ _id: course._id }, { $inc: { like_count: -1 } });
                return res.status(200).json({
                    message: 'Like removed successfully',
                    course
                });
            } else {
                res.status(400).json({
                    message: 'you are not allowed to unlike this course'
                });
            }
        }
         } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
}
