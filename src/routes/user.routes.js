import express from 'express';
const router = express.Router();
import { registerUser } from '../controllers/user.controller.js';

router.post('/',registerUser);

export default router;