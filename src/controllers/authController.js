import connection from '../db.js';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { usersRepository } from '../repositories/usersRepository.js';

export async function login(req, res) {
    const { email, password } = req.body;

    try {
        const user = await usersRepository.find(email)
        if (user.rowCount === 0) return res.sendStatus(401);

        if (bcrypt.compareSync(password, user.rows[0].password)) {
            const token = uuid();

            await usersRepository.createSession(user.rows[0].id, token);
            
            return res.status(200).send(token);
        }
        return res.sendStatus(401);
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
}

