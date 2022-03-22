import { Router } from 'express';
import { login } from '../controllers/authController.js';
import validateSchema from '../middlewares/validateSchemaMW.js';
import loginSchema from '../schemas/loginSchema.js';

const authRouter = Router();

authRouter.post('/login', validateSchema(loginSchema), login)

export default authRouter;