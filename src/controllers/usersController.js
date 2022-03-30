import bcrypt from 'bcrypt';
import urlMetadata from "url-metadata";
import { postsRepository } from '../repositories/postsRepository.js';
import { usersRepository } from '../repositories/usersRepository.js';

export async function searchUsers(req, res) {
    const name = req.query.name;
    const id = res.locals.user.id;
    try {
        const { rows: following } = await usersRepository.searchFollowedUser(id, name);
        const usersFollowed = [];
        following.map(user => {
            usersFollowed.push({
                ...user,
                follow: 'following'
            })
        });
        const { rows: users } = await usersRepository.searchUsersByName(name);
        const allUsers = [...usersFollowed];
        users.map(user => {
            let follow = '';
            if(user.id === id) {
                follow = 'you';
            }
            if(following.filter(e => e.followingId === user.id).length > 0) {
                follow = 'following';
            }
            allUsers.push({
                id: user.id,
                name: user.name,
                image: user.image,
                follow: follow
            });
        })
        return res.send(allUsers);
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
            if (data.link === null) {
                return res.send([{name, image}])
            }
            const metadata = await urlMetadata(data.link);
            const likes = await postsRepository.getLikesPostById(data.id);
            let liked = false;
            if (res.locals.user.id) {
                const userLike = await postsRepository.getLikesPostByUserId(data.id, res.locals.user.id);
                if (userLike.rowCount > 0) {
                    liked = true;
                }
            }
            postsArray.push({
                name,
                image,
                link: data.link,
                text: data.textPost,
                id: data.id,
                linkTitle: metadata.title,
                linkDescription: metadata.description,
                linkImage: metadata.image,
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