import mongoose from 'mongoose';

const restoreRegistrationSchema = new mongoose.Schema({
    id: { type: String, required: true },
    // Step 1: About You
    firstName: { type: String, required: true },
    surname: { type: String, required: true },
    ageRange: { type: String, required: true }, // 18-24, 25-34, 35-44, 45+
    gender: { type: String, required: true }, // Male, Female
    countryCode: { type: String, required: true, default: '+234' },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
    occupation: { type: String, required: true },

    // Step 2 & 3: Concerns
    concerns: [{ type: String }], // Array of strings for multi-select
    otherConcern: { type: String },
    mostPressingIssue: { type: String, required: true },
    duration: { type: String, required: true }, // How long they have been dealing with the issue (from original form)

    // Step 4: Support & Story
    previousSupport: { type: Boolean, required: true },
    supportDetails: { type: String },
    story: { type: String, required: true },
    consentToShare: { type: Boolean, required: true },

    // Step 5: Expectations & Scheduling
    expectations: { type: String, required: true },
    requestedDuration: { type: Number, required: true, default: 1 }, // 1, 2, or 3 hours

    // Automatic Assignments
    assignments: [{
        date: { type: Date, required: true },
        startTime: { type: String, required: true },
        endTime: { type: String, required: true }
    }],

    reassignmentHistory: [{
        reason: { type: String, required: true },
        date: { type: Date, default: Date.now },
        oldAssignments: [{
            date: { type: Date },
            startTime: { type: String },
            endTime: { type: String }
        }]
    }],

    // Step 6: Commitment & Payment
    feeAgreement: { type: Boolean, required: true },
    proofOfPayment: { type: String }, // URL or filename to the uploaded proof

    // Payment Promise (New Flow)
    paymentPromise: { type: Boolean, default: false },
    paymentDate: { type: Date },

    status: { type: String, default: 'pending' }, // pending, scheduled, completed, promised, incomplete
    reminderSent: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

restoreRegistrationSchema.pre('save', function () {
    this.updatedAt = Date.now();
});

const RestoreRegistration = mongoose.model('RestoreRegistration', restoreRegistrationSchema);
export default RestoreRegistration;
