import { postsRepository } from "../repositories/postsRepository.js";
import urlMetadata from "url-metadata";

export async function submitPost(req, res) {
  const { link, text } = req.body;
  const userId = res.locals.user.id;
  try {
    const post = {
      link,
      text,
      userId,
    };
    await postsRepository.create(post);
    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function getTimelinePosts(req, res) {
  try {
    const { rows: posts } = await postsRepository.getTimeline();

    const postsResponse = [];
    for (const post of posts) {
      const metadata = await urlMetadata(post.link);
      postsResponse.push({
        ...post,
        linkTitle: metadata.title,
        linkDescription: metadata.description,
        linkImage: metadata.image,
      });
    }
    res.send(postsResponse);
  } catch(error) {
    console.log(error);
    res.sendStatus(500);
  }
}
