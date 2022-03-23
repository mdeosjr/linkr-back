import { Router } from 'express';
import { createUser } from '../controllers/usersController.js';
import validateSchema from '../middlewares/validateSchemaMW.js';
import userSchema from '../schemas/userSchema.js';

const usersRouter = Router();

usersRouter.post('/users', validateSchema(userSchema), createUser);

export default usersRouter;