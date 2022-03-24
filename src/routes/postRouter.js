import { Router } from "express";
import { submitPost, getTimelinePosts, updatePost, deletePost } from "../controllers/postController.js";
import postSchema from "../schemas/postSchema.js";
import validateSchema from "../middlewares/validateSchemaMW.js";
import { validateToken } from "../middlewares/validateTokenMW.js";
import updatePostSchema from "../schemas/updatePostSchema.js";

const postRouter = Router();

postRouter.post("/post", validateToken, validateSchema(postSchema), submitPost);
postRouter.get("/timeline", validateToken, getTimelinePosts);
postRouter.delete('/post/:id',validateToken, deletePost);
postRouter.put('/post/:id', validateToken, validateSchema(updatePostSchema), updatePost);

export default postRouter;
