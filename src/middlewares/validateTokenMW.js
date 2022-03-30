import { usersRepository } from "../repositories/usersRepository.js";

export async function validateToken(req, res, next) {
  const authorization = req.headers.authorization;
  const token = authorization?.replace("Bearer ", "");
 
  if (!token) {
    return res.sendStatus(401);
  }

  const { rows: sessions } = await usersRepository.findSession(token);
  const [session] = sessions;
  if (!session) {
    return res.sendStatus(401);
  }

  const { rows: users } = await usersRepository.findUser(session.userId);
  const [user] = users;
  if (!user) {
    return res.sendStatus(401);
  }

  res.locals.user = user;
  next();
}