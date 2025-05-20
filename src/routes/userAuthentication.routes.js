import express from 'express';
const router = express.Router();
import { loginUser } from '../controllers/user.controller.js';

router.post('/',loginUser);

export default router;