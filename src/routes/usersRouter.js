import { Router } from 'express';
import { createUser, followUsers, getFollows, getUser, searchUsers, unfollowUser } from '../controllers/usersController.js';
import validateSchema from '../middlewares/validateSchemaMW.js';
import { validateToken } from '../middlewares/validateTokenMW.js';
import userSchema from '../schemas/userSchema.js';

const usersRouter = Router();

usersRouter.post('/users', validateSchema(userSchema), createUser);
usersRouter.get('/user/:id', validateToken, getUser);
usersRouter.get('/users/search', validateToken, searchUsers);
usersRouter.post('/follows/:followingId',validateToken,followUsers);
usersRouter.delete('/follows/:followingId',validateToken,unfollowUser);
usersRouter.get('/follows/:followingId',validateToken,getFollows);

export default usersRouter;