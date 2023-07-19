const joi = require('joi')

function validatedCommentSchema(data) {
    const commentSchema = joi.object({
        commentBody: joi.string().max(255).required(),
    })
    return commentSchema.validate(data)
}


module.exports = {validatedCommentSchema}
