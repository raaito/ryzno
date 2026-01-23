import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true }, // Keeping string ID for backward compatibility with frontend
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullName: { type: String },
    email: { type: String, unique: true },
    role: { type: String, enum: ['STUDENT', 'LECTURER', 'ADMIN'], default: 'STUDENT' },
    courses: [{ type: String }], // Array of course IDs
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
export default User;
