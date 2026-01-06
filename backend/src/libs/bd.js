import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING);
        console.log('connected to db');
    } catch (error) {
        console.log('can not connect to db!', error);
        process.exit(1);
    }
}