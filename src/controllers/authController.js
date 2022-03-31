import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { usersRepository } from "../repositories/usersRepository.js";

export async function login(req, res) {
  const { email, password } = req.body;

  try {
    const user = await usersRepository.find(email);
    if (user.rowCount === 0)
      return res.status(401).send("Usuário não cadastrado!");

    if (bcrypt.compareSync(password, user.rows[0].password)) {
      const token = uuid();

      await usersRepository.createSession(user.rows[0].id, token);

      delete user.rows[0].password;
      user.rows[0].token = token;
      return res.status(200).send(user.rows[0]);
    }
    return res.status(401).send("Usuário e/ou senha incorretos!");
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
}

export async function deleteSession(req, res) {
  const { id } = req.params;
  try {
    await usersRepository.deleteSession(id);
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
