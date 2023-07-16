const User = require('../model/user.model');
const Register = require('../model/quiz.model');


exports.setExamination = async(req, res ) => {
    try {
        const id = req.user;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);
        if(!userStatus.role === 'student') {
            return res.status(401).json({
                success: false,
                message: 'You are not authorized to access this resource',
            });
        }
        const {courseName, courseDuration, coursePrice, courseDescription } = req.body;
        
        if(req.files){
            const courseImage = req.files.courseImage;
        const register = await Register.create({
            courseName,
            courseName,
            courseDuration,
            coursePrice,
            courseDescription,
            courseImage: courseImage,
            user: user._id,
        });          
        return res.status(200).json({
            success: true,
            message: 'Register successfully',
            data: register
        });
    }
    } catch (error) {
        return res.json({
            success: false,
            message: 'Register failed',
            data: error.message
        });
    }
}


exports.getExamination = async(req, res) => {
    try {
        const id = req.user;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);
        if(userStatus.role === 'student') {
            return res.status(401).json({
                success: false,
                message: 'You are not authorized to access this resource',
            });
        }
        const { courseName } = req.body;
        const register = await Register.find({ courseName });
        return res.status(200).json({
            success: true,
            message: 'Registered subject fetch successfully',
            data: register
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Register failed',
            data: error.message
        });
    }
}

// view all the subjects
exports.viewAllExamination = async(req, res) => {
    try {
        const id = req.user;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);
        if (userStatus.role === 'student') {
            return res.status(401).json({
                success: false,
                message: 'You are not authorized to access this resource',
            });
        }
        const register = await Register.find();
        return res.status(200).json({
            success: true,
            message: 'Registered subject fetch successfully',
            data: register
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Register failed',
            data: error.message
        });
    }
}


exports.updateExamination = async(req, res) => {
    try {
        const id = req.user;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);
        if(userStatus.role === 'student') {
            return res.status(401).json({
                success: false,
                message: 'You are not authorized to access this resource',
            });
        }
        const { courseName, courseDuration, coursePrice, courseDescription } = req.body;
        if(req.files){
            const image = req.files.image;
        const register = await Register.findOneAndUpdate({ courseName }, {
            courseName,
            courseDuration,
            coursePrice,
            courseDescription,
            courseImage: image,
        },
        { new: true });
        return res.status(200).json({
            success: true,
            message: 'Register successfully',
            data: register
        });
    }
    } catch (error) {
        res.json({
            success: false,
            message: 'Register failed',
            data: error.message
        });
    }
}



exports.deleteExamination = async(req, res) => {
    try {
        const id = req.user;
        const user = await User.findById(id);
        const userStatus = await User.findById(user._id);
        if(userStatus.role === 'student') {
            return res.status(401).json({
                success: false,
                message: 'You are not authorized to access this resource',
            });
        }
        const { courseName } = req.body;
        const register = await Register.findOneAndDelete({ courseName });
        return res.status(200).json({
            success: true,
            message: 'Registered subjected deleted successfully',
            data: register
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Register failed',
            data: error.message
        });
    }
}
