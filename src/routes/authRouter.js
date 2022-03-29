import { Router } from 'express';
import { login, deleteSession } from '../controllers/authController.js';
import validateSchema from '../middlewares/validateSchemaMW.js';
import { validateToken } from '../middlewares/validateTokenMW.js';
import loginSchema from '../schemas/loginSchema.js';

const authRouter = Router();

authRouter.post('/login', validateSchema(loginSchema), login)
authRouter.delete('/sessions/:id', validateToken, deleteSession)
export default authRouter;