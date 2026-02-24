import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './server/models/User.js';

dotenv.config();

const reset = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const username = 'soar_admin';
        const newPassword = 'admin123';
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const result = await User.findOneAndUpdate(
            { username },
            { password: hashedPassword },
            { new: true }
        );

        if (result) {
            console.log(`Password for ${username} reset successfully to ${newPassword}`);
        } else {
            console.log(`User ${username} not found.`);
        }
    } catch (e) {
        console.error('Reset Error:', e);
    } finally {
        await mongoose.disconnect();
    }
};

reset();
