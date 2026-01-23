import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true }, // e.g., 'bookSale', 'academyAd'
    value: { type: mongoose.Schema.Types.Mixed, required: true } // Stores the JSON object
});

const Setting = mongoose.model('Setting', settingSchema);
export default Setting;
