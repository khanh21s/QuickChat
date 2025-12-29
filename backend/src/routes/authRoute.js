import express from 'express';
import { singUp } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', singUp);

export default router;
