const Comment = require('../models/comment.model');
const jwt = require('jsonwebtoken');

exports.likeComment = ( async (req, res) => {
    const { token, _id } = req.body;

    if(!token || !_id)
      return res.status(400).send({status: 'error', msg: 'All fields must be filled'});

    try{
        const user = jwt.verify(token, process.env.JWT_SECRET);

        let comment = await Comment.findOne({_id, likes: user._id}).lean();
        if(comment)
          return res.status(400).send({status: 'error', msg: "You've already liked this comment"});

        comment = await Comment.findOneAndUpdate(
            {_id},
            {
                '$push': {likes: user._id},
                '$inc': {like_count: 1}
            },
            {new: true}
        );
        return res.status(200).send({status: 'ok', msg: 'Comment liked successfully', comment});
    }catch(e) {
        console.log(e);
        return res.status(400).send({status: 'error', msg: 'Some error occurred', e});
    }
});


exports.unlikeComment = (async (req, res) => {
    const { _id, token } = req.body;

    if(!_id || !token) 
      return res.status(400).send({status: 'error', msg: 'All fields must be filled'});

    try{
        const user = jwt.verify(token, process.env.JWT_SECRET);

        let comment = Comment.findOne({_id, likes: user._id}).lean();
        if(!comment) 
          return res.status(400).send({status: 'error', msg: 'You have not liked this comment before'});

        comment = await Comment.findOneAndUpdate(
            {_id, likes: user._id},
            {
                '$pull': {likes: user._id},
                '$inc': {like_count: -1}
            }
        ).lean();
        return res.status(200).send({status: 'ok', msg: 'Comment unliked successfully', comment});
    }catch(e) {
        console.log(e);
        return res(400).send({status: 'error', msg: 'Some error occurred', e})
    }
})