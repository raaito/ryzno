import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String },
    thumbnail: { type: String }
});

const Course = mongoose.model('Course', courseSchema);
export default Course;
