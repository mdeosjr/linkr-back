import { Router } from 'express';
import usersRouter from './usersRouter.js';
import authRouter from './authRouter.js';

const router = Router();

router.use(usersRouter);
router.use(authRouter);

export default router;