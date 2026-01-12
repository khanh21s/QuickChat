import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './libs/bd.js';
import authRouter from './routes/authRoute.js';
import userRoute from './routes/userRoute.js';
import cookieParser from 'cookie-parser';
import { protectedRoute } from './middlewares/authMiddleware.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// middlewares
app.use(express.json());
app.use(cookieParser());

// public router
app.use('/api/auth', authRouter);

// private router
app.use(protectedRoute);
app.use('/api/users', userRoute);



connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`server running on port http://localhost:${PORT}`);
    });
});
