import { postsRepository } from "../repositories/postsRepository.js";
import { hashtagsRepository } from "../repositories/hashtagsRepository.js";
import urlMetadata from "url-metadata";

export async function getLikesPost(req, res) {
  const postId = req.params.postId;
  try {
    const likes = await postsRepository.getLikesPostById(postId);

    
    res.send({ likes: likes.rowCount, userLike: liked });

  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function submitLike(req, res) {
  const {postId} = req.params;
  const userId = res.locals.user.id;
  try {
    const liked = await postsRepository.findLikeByUserId(userId, postId);
    if(liked.rowCount === 0) {
      await postsRepository.postLike(postId, userId);
      return res.sendStatus(200)
    }

    return res.sendStatus(409)

  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
export async function submitUnlike(req, res) {
  const {postId} = req.params;
  const userId = res.locals.user.id;
  try {
    const liked = await postsRepository.findLikeByUserId(userId, postId);
    if(liked.rowCount > 0) {
      await postsRepository.deleteLike(postId, userId);
      return res.sendStatus(200)
    }
    return res.sendStatus(409);

  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function updatePost(req, res) {
  const { id } = req.params;
  const { text } = req.body;
  try {
    const {
      rows: [post],
    } = await postsRepository.findPost(id);

    if (!post) {
      return res.sendStatus(404);
    }
    if (post.userId != res.locals.user.id) {
      return res.sendStatus(422);
    }
    await postsRepository.updatePost(id, text);
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function submitPost(req, res, next) {
  const { link, text } = req.body;
  const userId = res.locals.user.id;

  const hashtags = text.match(/#\w+/g);

  try {
    const post = {
      link,
      text,
      userId,
    };
    await postsRepository.create(post);
    console.log(hashtags);
    if (hashtags !== null) {
      for (const value of hashtags) {
        const hashtag = value.substring(1).toLowerCase();

        const findHashtag = await hashtagsRepository.findHashtag(hashtag);
        if (findHashtag.rows.length === 0) {
          await hashtagsRepository.createHashtag(hashtag);
        }
      }
    }

    res.sendStatus(201);
    next();
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function populatePostsHashtags(req, res) {
  const { link, text } = req.body;
  const userId = res.locals.user.id;
  const hashtags = text.match(/#\w+/g);

  const post = {
    link,
    text,
    userId,
  };

  const { rows: postId } = await hashtagsRepository.getPostId(post);

  if (hashtags !== null) {
    for (const value of hashtags) {
      const hashtag = value.substring(1).toLowerCase();

      const { rows: hashtagId } = await hashtagsRepository.getHashtagId(
        hashtag
      );

      await hashtagsRepository.createPostsHashtagsEntry(
        hashtagId[0].id,
        postId[0].id
      );
    }
  }
}

export async function getTimelinePosts(req, res) {
  try {
    const { rows: posts } = await postsRepository.getTimeline();


    const postsResponse = [];
    for (const post of posts) {
      const likes = await postsRepository.getLikesPostById(post.id);
      let liked = false;
      if (res.locals.user.id) {
        const userLike = await postsRepository.getLikesPostByUserId(post.id, res.locals.user.id);
        if (userLike.rowCount > 0) {
          liked = true;
        }
      }
      const metadata = await urlMetadata(post.link);
      postsResponse.push({
        ...post,
        linkTitle: metadata.title,
        linkDescription: metadata.description,
        linkImage: metadata.image,
        likes: likes.rowCount,
        liked: liked,
        usersLikes: likes.rows.map(like => like.name)
      });
    }
    res.send(postsResponse);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function deletePost(req, res) {
  const { id } = req.params;
  try {
    const result = await postsRepository.selectPost(id, res.locals.user.id);
    if (result.rowCount === 0) {
      return res.sendStatus(401);
    }
    await postsRepository.deletePost(id);
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function getPostByHashtag(req, res) {
  const { hashtag } = req.params;

  try {
    const {rows:result} = await postsRepository.getPostByHashtag(hashtag);
    if (result.rowCount === 0) {
      return res.sendStatus(404);
    }
    const postsResponse = [];
    for (const post of result) {
      const metadata = await urlMetadata(post.link);
      postsResponse.push({
        ...post,
        linkTitle: metadata.title,
        linkDescription: metadata.description,
        linkImage: metadata.image,
      })}
        res.send(postsResponse);
      } catch (error) {
        console.log(error);
        res.sendStatus(500);
      }
    }

    export async function getTrendingHashtags(req, res) {
      try {
        const { rows: hashtags } = await hashtagsRepository.getTrendingHashtags();
        res.send(hashtags);
      } catch {
        console.log(error);
        res.sendStatus(500);
      }
    }
