import { commentsRepository } from "../repositories/commentsRepository.js";

export async function createComment(req, res) {
  const { postId, userId, textComment } = req.body;

  try {
    await commentsRepository.createComment(textComment, userId, postId);
    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export async function getPostComments(req, res) {
  const { postId } = req.params;

  try {
    const { rows: posts } = await commentsRepository.getPostComments(postId);
    res.send(posts);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}
