import { postsRepository } from "../repositories/postsRepository.js";


export async function submitPost(req, res) {
    const { link, text } = req.body;
    const userId = res.locals.user.id;
    try {
        const post = {
            link, text, userId
        }
        await postsRepository.create(post);
        res.sendStatus(201);

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export async function deletePost(req,res){
    const {id}=req.params;
    try {
        const result=await postsRepository.selectPost (id,res.locals.user.id);
        if(result.rowCount===0){
           return res.sendStatus(401);
        }
        await postsRepository.deletePost(id);
        res.sendStatus(200);
    } catch (error) {
       
        res.sendStatus(500);
    }
}