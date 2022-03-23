import joi from "joi";

const postSchema = joi.object({
    link: joi.string().uri().required(),
    text: joi.string()
});

export default postSchema;