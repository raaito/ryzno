import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Course from './models/Course.js';
import Lesson from './models/Lesson.js';
import Setting from './models/Setting.js';
import Contact from './models/Contact.js';

dotenv.config();

const users = [
    {
        id: 'admin-1',
        username: 'soar_admin',
        password: '$2b$10$wr06PXuNyJeAghae4p5SoO.yMwiz6mKWong85Qe7IjT7vahwbgKBO', // Hashed 'sentinel2026'
        role: 'LECTURER'
    }
];

const bookSale = {
    isVisible: true,
    title: 'Becoming as an Art of Worship',
    presalePrice: 15000,
    regularPrice: 60000,
    expiryDate: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
    amazonLink: 'https://amazon.com',
    selarLink: 'https://selar.co',
    bookImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80'
};

const academyAd = {
    isVisible: true,
    title: 'The Wealthy Place',
    description: 'A transformative course designed to unlock your financial destiny and spiritual abundance.',
    price: 35000,
    buttonLink: 'https://selar.co/wealthy-place',
    image: 'https://images.unsplash.com/photo-1579621970563-ebec7560eb3e?auto=format&fit=crop&q=80'
};

const courses = [
    {
        id: 'fundamentals',
        title: 'Sentinel Fundamentals',
        description: 'Core principles of accountability and spiritual grounding.',
        thumbnail: 'https://images.unsplash.com/photo-1454165833767-027508496b4f?auto=format&fit=crop&q=80'
    },
    {
        id: 'leadership',
        title: 'Divine Leadership',
        description: 'Leading spheres of influence through the RYZNO movement.',
        thumbnail: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80'
    }
];

const lessons = [
    {
        id: 'lesson-1',
        courseId: 'fundamentals',
        title: 'Introduction to Sentinels',
        description: 'Building the foundation of accountability.',
        type: 'video',
        url: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80',
        resources: {
            notes: 'Notes on spiritual grounding.',
            assignment: 'Reflection task.'
        }
    }
];

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Seeding');

        // Clear existing data (optional, but good for idempotent seeding initially)
        await User.deleteMany({});
        await Course.deleteMany({});
        await Lesson.deleteMany({});
        await Setting.deleteMany({});
        // await Contact.deleteMany({}); // Keep contacts usually

        // Insert Users
        await User.insertMany(users);
        console.log('Users Seeded');

        // Insert Courses
        await Course.insertMany(courses);
        console.log('Courses Seeded');

        // Insert Lessons
        await Lesson.insertMany(lessons);
        console.log('Lessons Seeded');

        // Insert Settings
        await Setting.create({ key: 'bookSale', value: bookSale });
        await Setting.create({ key: 'academyAd', value: academyAd });
        console.log('Settings Seeded');

        console.log('Data Migration Complete!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

seedData();
