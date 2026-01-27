import mongoose from 'mongoose';

const restoreRegistrationSchema = new mongoose.Schema({
    id: { type: String, required: true },
    // Step 1: About You
    firstName: { type: String, required: true },
    surname: { type: String, required: true },
    ageRange: { type: String, required: true }, // 18-24, 25-34, 35-44, 45+
    gender: { type: String, required: true }, // Male, Female
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
    occupation: { type: String, required: true },

    // Step 2 & 3: Concerns
    concerns: [{ type: String }], // Array of strings for multi-select
    otherConcern: { type: String },
    mostPressingIssue: { type: String, required: true },
    duration: { type: String, required: true }, // Less than 6 months, etc.

    // Step 4: Support & Story
    previousSupport: { type: Boolean, required: true },
    supportDetails: { type: String },
    story: { type: String, required: true },
    consentToShare: { type: Boolean, required: true },

    // Step 5: Expectations & Scheduling
    expectations: { type: String, required: true },
    preferredTime: { type: String, required: true }, // 6.00 PM - 7.00 PM, etc.
    alternativeTimeConsent: { type: Boolean, required: true },

    // Step 6: Commitment & Payment
    feeAgreement: { type: Boolean, required: true },
    proofOfPayment: { type: String }, // URL or filename to the uploaded proof

    status: { type: String, default: 'pending' }, // pending, reviewed, scheduled, completed
    createdAt: { type: Date, default: Date.now }
});

const RestoreRegistration = mongoose.model('RestoreRegistration', restoreRegistrationSchema);
export default RestoreRegistration;
