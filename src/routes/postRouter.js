import { Router } from "express";
import { submitPost, getTimelinePosts } from "../controllers/postController.js";
import postSchema from "../schemas/postSchema.js";
import validateSchema from "../middlewares/validateSchemaMW.js";
import { validateToken } from "../middlewares/validateTokenMW.js";
import { deletePost } from "../controllers/postController.js";

const postRouter = Router();

postRouter.post("/post", validateToken, validateSchema(postSchema), submitPost);
postRouter.get("/timeline", validateToken, getTimelinePosts);
postRouter.delete('/post/:id',validateToken, deletePost);

export default postRouter;
