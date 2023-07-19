const Comment = require("../models/comment.model");
const User = require("../models/user.model");
const Course = require('../models/course.model');


exports.createComment = async(req, res) => {
    try {
        const id= req.user; 
        const user = await User.findById(id);
        const userStatus = await User.findOne({ _id: user._id });
        if(userStatus.roles === 'student' && userStatus.roles === 'IT'){
            const course = await Course.findOne({ _id: req.params.courseId });
            const savedComment = await Comment.create({
                content: req.body.content,
                userId: userStatus._id,
                courseId: course._id
            });
            await User.findByIdAndUpdate({ _id: userStatus._id }, { $push: { comments: savedComment.content } });
            await Course.findOneAndUpdate({ _id: req.params.courseId }, 
                { $push: { comments: savedComment.content }, $inc: { comment_counts: +1 } },
                { new: true });
            return res.status(200).json({
                message: "Comment created successfully",
                comment: savedComment
            });
        }
        else {
            return res.status(401).json({
                message: "You are not authorized to create comments"
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: "Error while creating comment",
            error: error.message
        });
    }
};
   
exports.getComments = async(req, res) => {
    try {
        const id= req.user;
        const user = await User.findById(id);
        const userStatus = await User.findOne({ _id: user._id });
        if(userStatus.roles === 'student' && userStatus.roles === 'IT'){
            const course = await Course.findOne({ _id: req.params.courseId });
            const comments = await Comment.find({ courseId: course._id });
            return res.status(200).json({
                message: "Comments fetched successfully",
                comments: comments
            });
        }
        else {
            res.status(401).json({
                message: "You are not authorized to fetch comments"
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Error while fetching comments",
            error: error.message
        });
    }
};


// update comment

exports.updateComment = async(req, res) => {
    try {
        const id= req.user;
        const user = await User.findById(id);
        const userStatus = await User.findOne({ _id: user._id });
        if(userStatus.roles === 'student' && userStatus.roles === 'IT'){
            const course = await Course.findOne({ _id: req.params.courseId });
            const comment = await Comment.findOne({ _id: req.params.commentId });
            await Comment.findOneAndUpdate({ _id: comment._id }, { content: req.body.content });
            await User.findOneAndUpdate({ _id: userStatus._id }, { $pull: { comments: comment._id } });
            await Course.findOneAndUpdate({ _id: course._id }, { $pull: { comments: comment._id } });
            return res.status(200).json({
                message: "Comment updated successfully",
                comment: comment
            });
        }
        else {
            return res.status(401).json({
                message: "You are not authorized to update comments"
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Error while updating comment",
            error: error.message
        });
    }
};


// delete comment

exports.deleteComment = async(req, res) => {
    try {
        const id= req.user;
        const user = await User.findById(id);
        const userStatus = await User.findOne({ _id: user._id });
        if(userStatus.roles === 'student' && userStatus.roles === 'IT'){
        const comment = await Comment.findOne({ _id: req.params.commentId });
        await Comment.findOneAndDelete({ _id: comment._id });
        await User.findOneAndUpdate({ _id: userStatus._id }, { $pull: { comments: comment._id } });
        await Course.findOneAndUpdate({ _id: comment.courseId }, { $pull: { comments: comment._id } });
        return res.status(200).json({
            message: "Comment deleted successfully",
            comment: comment
        });
    }else{
        return res.status(401).json({
            message: 'You are not authorized here'
        })
    }
    } catch (error) {
        res.status(500).json({
            message: "Error while deleting comment",
            error: error.message
        });
    }
};


// reply a comment 

exports.replyComment = async(req, res) => {
    try {
        const id= req.user;
        const user = await User.findById(id);
        const userStatus = await User.findOne({ _id: user._id });
        if(userStatus.roles === 'student' && userStatus.roles === 'IT'){
        const comment = await Comment.findOne({ _id: req.params.commentId });
        const reply = await Comment.create({
            content: req.body.content,
            userId: userStatus._id,
            courseId: comment.courseId,
        });
        await User.findByIdAndUpdate({ _id: userStatus._id }, { $push: { replies: reply.content } });
        await Course.findOneAndUpdate({ _id: comment.courseId }, 
            { $push: { replies: reply.content }, $inc: { comment_counts: +1 } },
            { new: true });
        return res.status(200).json({
            message: "Reply created successfully",
            reply: reply
        });
    }else{
        res.status(401).json({
            message: "You are not authorized to reply to comments"
        });
    }
    } catch (error) {
        return res.status(500).json({
            message: "Error while creating reply",
            error: error.message
        });
    }
};