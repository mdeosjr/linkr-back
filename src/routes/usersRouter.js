import { Router } from 'express';
import { createUser, getUser, searchUsers } from '../controllers/usersController.js';
import validateSchema from '../middlewares/validateSchemaMW.js';
import { validateToken } from '../middlewares/validateTokenMW.js';
import userSchema from '../schemas/userSchema.js';

const usersRouter = Router();

usersRouter.post('/users', validateSchema(userSchema), createUser);
usersRouter.get('/user/:id', validateToken, getUser);
usersRouter.get('/users/search', searchUsers)

export default usersRouter;