import joi from "joi";

const postSchema = joi.object({
    link: joi.string().uri().required(),
    text: joi.string(),
    title: joi.string().required(),
    description: joi.string(),
    image: joi.string().uri()
});

export default postSchema;