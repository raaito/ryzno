
import mongoose from 'mongoose';
import CommunityMember from './server/models/CommunityMember.js';
import crypto from 'crypto';

const MONGODB_URI = 'mongodb://127.0.0.1:27017/ryzno'; // Adjusted based on common local setup

async function testSave() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to DB");

        const testData = {
            id: crypto.randomUUID(),
            firstName: "Test",
            surname: "User",
            ageRange: "26-35",
            phoneNumber: "123456789",
            birthDay: "10",
            birthMonth: "March",
            stateOfResidence: "Lagos",
            profession: "Tester",
            socialPlatforms: ["Instagram"],
            favouritePlatform: "Instagram",
            bestThing: "Testing stuff",
            heardAboutUs: "Ad",
            reasonForJoining: "To test",
            activelyParticipate: "Yes"
        };

        const member = await CommunityMember.create(testData);
        console.log("Member saved successfully:", member.id);

        const found = await CommunityMember.findOne({ id: member.id });
        console.log("Member found in DB:", found ? "Yes" : "No");

        await mongoose.disconnect();
    } catch (err) {
        console.error("Test failed:", err);
    }
}

testSave();
