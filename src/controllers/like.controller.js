const Comment = require('../models/comment.model');
const Course = require('../models/course.model');
const User = require('../models/user.model');


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
