import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './libs/bd.js';
import authRouter from './routes/authRoute.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// middlewares
app.use(express.json());

// public router
app.use('/api/auth', authRouter);

// private router



connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`server running on port http://localhost:${PORT}`);
    });
});
