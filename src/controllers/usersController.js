import bcrypt from 'bcrypt';
import { usersRepository } from '../repositories/usersRepository.js';

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