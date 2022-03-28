import bcrypt from 'bcrypt';
import urlMetadata from "url-metadata";
import { usersRepository } from '../repositories/usersRepository.js';

export async function searchUsers(req, res) {
    const name = req.query.name;
    try {
        const {rows: users} = await usersRepository.searchUsersByName(name);
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
        for(const data of userArray.rows) {
            if (data.link === null) break;
            const metadata = await urlMetadata(data.link);
            postsArray.push({
                name,
                image,
                link: data.link,
                text: data.textPost,
                linkTitle: metadata.title,
                linkDescription: metadata.description,
                linkImage: metadata.image
            }) 
        }
        res.status(200).send(postsArray)
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
}