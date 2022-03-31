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
  const user = res.locals.user;
  let postsArray = [];

  try {
    const { rows: posts } = await commentsRepository.getPostComments(postId);
    for (const row of posts) {
      const { rows: following } =
        await commentsRepository.getUsersThatAreBeingFollowedByUserId(user.id);

      if (following.some((e) => e.followingId === row.userId)) {
        postsArray.push({
          ...row,
          following: true,
        });
      } else {
        postsArray.push({
          ...row,
          following: false,
        });
      }
    }
    res.send(postsArray);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}
