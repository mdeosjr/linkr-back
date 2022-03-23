import { Router } from "express";
import { deletePost } from "../controllers/postController.js";

const postRouter=Router();
postRouter.delete('/post/:id',deletePost);

export default postRouter;