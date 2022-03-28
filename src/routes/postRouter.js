import { Router } from "express";
import {
  submitPost,
  getTimelinePosts,
  updatePost,
  deletePost,
  populatePostsHashtags,
  getPostByHashtag,
  getTrendingHashtags,
  getLikesPost,
  submitLike,
  submitUnlike,
} from "../controllers/postController.js";
import postSchema from "../schemas/postSchema.js";
import validateSchema from "../middlewares/validateSchemaMW.js";
import { validateToken } from "../middlewares/validateTokenMW.js";
import updatePostSchema from "../schemas/updatePostSchema.js";

const postRouter = Router();

postRouter.post(
  "/post",
  validateToken,
  validateSchema(postSchema),
  submitPost,
  populatePostsHashtags
);
postRouter.get("/timeline", validateToken, getTimelinePosts);
postRouter.delete("/post/:id", validateToken, deletePost);
postRouter.put(
  "/post/:id",
  validateToken,
  validateSchema(updatePostSchema),
  updatePost
);
postRouter.get("/hashtag/:hashtag", getPostByHashtag);
postRouter.get("/trendingHashtags", validateToken, getTrendingHashtags);
postRouter.get("/likes/:postId", validateToken, getLikesPost)
postRouter.post("/likes/:postId", validateToken, submitLike)
postRouter.delete("/likes/:postId", validateToken, submitUnlike)

export default postRouter;
