import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './server/models/User.js';

dotenv.config();

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const users = await User.find({}, 'username email role');
        console.log('--- USER LIST ---');
        console.log(JSON.stringify(users, null, 2));
    } catch (e) {
        console.error('Check Error:', e);
    } finally {
        await mongoose.disconnect();
    }
};

check();
