import { postsRepository } from "../repositories/postsRepository.js";
import urlMetadata from "url-metadata";

export async function updatePost(req, res) {
    const { id } = req.params;
    const {text} = req.body;
    try {
        const { rows: [post] } = await postsRepository.findPost(id);
        
        if(!post){
            return res.sendStatus(404);
        }
        if(post.userId != res.locals.user.id){
            console.log("FOI AQUI NO updatePost")
            return res.sendStatus(422);
        }
        await postsRepository.updatePost(id, text);
        res.sendStatus(200);

    } catch (error) {
        console.log(error);
        res.sendStatus(500)
    }
}

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
