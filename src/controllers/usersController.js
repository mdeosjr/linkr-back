import bcrypt from 'bcrypt';
import { postsRepository } from "../repositories/postsRepository.js";
import { usersRepository } from '../repositories/usersRepository.js';

export async function searchUsers(req, res) {
    const name = req.query.name;
    try {
        const { rows: users } = await usersRepository.searchUsersByName(name);
        return res.send(users);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export async function createUser(req, res) {
    const { name, email, password, image } = req.body;

    try {
        const existingUser = await usersRepository.find(email);
        if (existingUser.rowCount > 0) return res.status(409).send("Usuário já cadastrado!");

        const passwordHash = bcrypt.hashSync(password, 10);

        await usersRepository.create(name, email, passwordHash, image);
        res.sendStatus(201);
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
}

export async function getUser(req, res) {
    const { id } = req.params;

    try {
        const user = await usersRepository.findUser(id);
        if (user.rowCount === 0) return res.status(404).send("Usuário não existe!");

        const userArray = await usersRepository.getUserData(id);
        const name = userArray.rows[0].name;
        const image = userArray.rows[0].image;

        const postsArray = [];
        for (const data of userArray.rows) {
            const {rows: [metadata]} = await postsRepository.getMetadataByLink(data.link);
            const likes = await postsRepository.getLikesPostById(data.postId);
            let liked = false;
            if (res.locals.user.id) {
                const userLike = await postsRepository.getLikesPostByUserId(data.postId, res.locals.user.id);
                if (userLike.rowCount > 0) {
                    liked = true;
                }
            }
            postsArray.push({
                name,
                image,
                link: data.link,
                text: data.textPost,
                postId: data.postId,
                userId: data.userId,
                linkTitle: metadata.linkTitle,
                linkDescription: metadata.linkDescription,
                linkImage: metadata.linkImage,
                likes: likes.rowCount,
                liked: liked,
                usersLikes: likes.rows.map(like => like.name)
            })
        }
        res.status(200).send(postsArray)
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
}

export async function followUsers(req,res){
    const{followingId}=req.params;
    const userId = res.locals.user.id;
    
    try {
       const result= await usersRepository.followUser(userId,followingId);
       if(result.rowCount>0){
        return res.sendStatus(409);
       }

       await usersRepository.insertFollow(userId,followingId);
       res.sendStatus(200);    
        
    } catch (error) {
        console.log(error);
        res.sendStatus(500);        
    }

}

export async function unfollowUser(req,res){
    const{followingId}=req.params;
    const userId=res.locals.user.id;
    
    try {
        const result= await usersRepository.followUser(userId,followingId);
        console.log(result.rows);
        if(result.rowCount===0){
            return res.sendStatus(409);
        }
        await usersRepository.deleteFollow(userId,followingId);
        res.sendStatus(200);
        
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}
export async function getFollows(req,res){
    const {followingId}=req.params;
    const userId=res.locals.user.id;
    let follow=false;
    try {
        const result = await usersRepository.getFollows(userId,followingId)
        if(result.rowCount===0){
            return res.send(follow);
        }
        follow=true;
        res.status(200).send({
            ...result.rows[0],
               follow});
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}