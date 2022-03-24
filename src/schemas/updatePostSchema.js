import joi from 'joi';

const updatePostSchema = joi.object({
    text: joi.string()
})

export default updatePostSchema;