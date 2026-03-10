import mongoose from 'mongoose';

const communityMemberSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    ageRange: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    birthDay: { type: String, required: true },
    birthMonth: { type: String, required: true },
    stateOfResidence: { type: String, required: true },
    profession: { type: String, required: true },
    socialPlatforms: [{ type: String }],
    favouritePlatform: { type: String, required: true },
    bestThing: { type: String, required: true },
    heardAboutUs: { type: String, required: true },
    reasonForJoining: { type: String, required: true },
    activelyParticipate: { type: String, required: true }, // 'Yes' or 'No' as per form
    profilePicture: { type: String }, // Base64 or URL
    createdAt: { type: Date, default: Date.now }
});

const CommunityMember = mongoose.model('CommunityMember', communityMemberSchema);
export default CommunityMember;
