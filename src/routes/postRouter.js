import { Router } from "express";
import { submitPost } from "../controllers/postController.js";
import postSchema from "../schemas/postSchema.js";
import { validateSchema } from "../middlewares/validateSchemaMW.js";
import { validateToken } from "../middlewares/validateTokenMW.js";

const postRouter = Router();

postRouter.post('/post', validateToken, validateSchema(postSchema), submitPost);

export default postRouter;