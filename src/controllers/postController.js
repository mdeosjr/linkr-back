import { postRepository } from "../repositories/postRespository.js";

export async function deletePost(req,res){
    const {id}=req.params;
    try {
        const result=await postRepository.selectPost (id);
        if(result.rowCount===0){
           return res.sendStatus(401);
        }
        await postRepository.deletePost(id);
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}