import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    courseId: { type: String, required: true, ref: 'Course' }, // Reference by query, not strict DB ref yet due to string IDs
    title: { type: String, required: true },
    description: { type: String },
    type: { type: String, enum: ['video', 'text', 'quiz'], default: 'video' },
    url: { type: String },
    thumbnail: { type: String },
    resources: {
        notes: { type: String },
        assignment: { type: String }
    }
});

const Lesson = mongoose.model('Lesson', lessonSchema);
export default Lesson;
