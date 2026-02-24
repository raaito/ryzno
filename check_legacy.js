import mongoose from 'mongoose';
import dotenv from 'dotenv';
import RestoreRegistration from './server/models/RestoreRegistration.js';

dotenv.config();

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const all = await RestoreRegistration.find({});
        const legacy = all.filter(r => !r.assignments || r.assignments.length === 0);
        console.log('Total Registrations:', all.length);
        console.log('Legacy (No Assignments):', legacy.length);
        console.log('Sample Legacy Record:', JSON.stringify(legacy[0], null, 2));
    } catch (e) {
        console.error('Error:', e);
    } finally {
        await mongoose.disconnect();
    }
};

check();
