import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    source: { type: String, default: 'General' },
    status: { type: String, default: 'unread' },
    createdAt: { type: Date, default: Date.now }
});

const Contact = mongoose.model('Contact', contactSchema);
export default Contact;
