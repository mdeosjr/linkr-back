import { postsRepository } from "../repositories/postsRepository.js";
import { hashtagsRepository } from "../repositories/hashtagsRepository.js";
import urlMetadata from "url-metadata";
import { commentsRepository } from "../repositories/commentsRepository.js";

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
  const { postId } = req.params;
  const userId = res.locals.user.id;
  try {
    const liked = await postsRepository.findLikeByUserId(userId, postId);
    if (liked.rowCount === 0) {
      await postsRepository.postLike(postId, userId);
      return res.sendStatus(200);
    }

    return res.sendStatus(409);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function submitUnlike(req, res) {
  const { postId } = req.params;
  const userId = res.locals.user.id;
  try {
    const liked = await postsRepository.findLikeByUserId(userId, postId);
    if (liked.rowCount > 0) {
      await postsRepository.deleteLike(postId, userId);
      return res.sendStatus(200);
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
    const metadata = await urlMetadata(link);
    const metaDataUrl = {
      linkTitle: metadata.title,
      linkDescription: metadata.description,
      linkImage: metadata.image,
    };
    const post = {
      link,
      text,
      userId,
    };
    await postsRepository.create(post);
    await postsRepository.createMetadata(link, metaDataUrl);

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
        hashtagId[0]?.id,
        postId[0]?.id
      );
    }
  }
}

export async function getTimelinePosts(req, res) {
  const userId = res.locals.user.id;
  try {
    const { rows: posts } = await postsRepository.getTimeline(userId);

    const postsResponse = [];
    for (const post of posts) {
      const {
        rows: [metadata],
      } = await postsRepository.getMetadataByLink(post.link);
      const likes = await postsRepository.getLikesPostById(post.id);
      const { rows: comments } =
        await commentsRepository.getNumberOfCommentsByPostId(post.id);

      let liked = false;
      if (res.locals.user.id) {
        const userLike = await postsRepository.getLikesPostByUserId(
          post.id,
          res.locals.user.id
        );
        if (userLike.rowCount > 0) {
          liked = true;
        }
      }
      let cont = 0;

      const newLikes = likes.rows.map((like) => {
        if (like.name === res.locals.user.name && cont === 0) {
          cont++;
          return "Você";
        } else {
          return like.name;
        }
      });

      const indexOfUser = newLikes.indexOf("Você");
      if (indexOfUser > 0) {
        const aux = newLikes[0];
        newLikes[0] = "Você";
        newLikes[indexOfUser] = aux;
      }

      postsResponse.push({
        ...post,
        linkTitle: metadata.linkTitle,
        linkDescription: metadata.linkDescription,
        linkImage: metadata.linkImage,
        likes: likes.rowCount,
        liked: liked,
        comments: comments[0].numberOfComments,
        usersLikes: newLikes,
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
    const post = result.rows[0].postHashtagId;
    await postsRepository.deletePostLikes(id);
    if (post !== null) {
      await postsRepository.deletePostHashtags(id);
    }
    await postsRepository.deletePost(id);
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function getPostByHashtag(req, res) {
  const { hashtag } = req.params;

  try {
    const { rows: result } = await postsRepository.getPostByHashtag(hashtag);
    if (result.rowCount === 0) {
      return res.sendStatus(404);
    }
    const postsResponse = [];
    for (const post of result) {
      const {
        rows: [metadata],
      } = await postsRepository.getMetadataByLink(post.link);
      const { rows: comments } =
        await commentsRepository.getNumberOfCommentsByPostId(post.id);

      const likes = await postsRepository.getLikesPostById(post.id);
      let liked = false;
      if (res.locals.user.id) {
        const userLike = await postsRepository.getLikesPostByUserId(
          post.id,
          res.locals.user.id
        );
        if (userLike.rowCount > 0) {
          liked = true;
        }
      }
      postsResponse.push({
        ...post,
        linkTitle: metadata.linkTitle,
        linkDescription: metadata.linkDescription,
        linkImage: metadata.linkImage,
        likes: likes.rowCount,
        liked: liked,
        comments: comments[0].numberOfComments,
        usersLikes: likes.rows.map((like) => like.name),
      });
    }
    res.send(postsResponse);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function getTrendingHashtags(req, res) {
  try {
    const { rows: hashtags } = await hashtagsRepository.getTrendingHashtags();
    return res.send(hashtags);
  } catch {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function getFollowingPosts(req, res) {
  const { id } = req.params;

  try {
    const { rows: result } = await postsRepository.getFollowingPosts(id);
    res.status(200).send(result);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
}

export async function countFollows(req,res){
  const userId=res.locals.user.id;
  try {
    const result= await postsRepository.countFollows(userId);
    res.status(200).send(result.rows[0]);
    
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
    
  }
}
