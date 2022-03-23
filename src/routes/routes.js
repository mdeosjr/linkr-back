import { Router } from 'express';
import usersRouter from './usersRouter.js';
import authRouter from './authRouter.js';
import postRouter from './postRouter.js';

const router = Router();

router.use(usersRouter);
router.use(authRouter);
router.use(postRouter);

export default router;