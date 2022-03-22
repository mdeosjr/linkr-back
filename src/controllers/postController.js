import { postsRepository } from "../repositories/postsRepository.js";

export async function submitPost(req, res) {
    const { link, text } = req.body;
    const userId = res.locals.user.id;
    try {
        const post = {
            link, text, userId
        }
        await postsRepository.create(post);

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}