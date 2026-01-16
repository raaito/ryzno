import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const app = express();
const JWT_SECRET = 'ryzno_sentinel_secret_key_2026'; // In production, use env variable

app.use(cors());
app.use(express.json());

// --- MOCK DATABASE ---
// NOTE: In a serverless environment like Vercel, these arrays will reset 
// when the function cold-starts. Data persistence requires an external database.
let users = [
    {
        id: 'admin-1',
        username: 'soar_admin',
        password: '$2b$10$wr06PXuNyJeAghae4p5SoO.yMwiz6mKWong85Qe7IjT7vahwbgKBO', // Hashed 'sentinel2026'
        role: 'LECTURER'
    }
];

let courses = [
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

let lessons = [
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

// --- MIDDLEWARE ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'No token provided' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid or expired token' });
        req.user = user;
        next();
    });
};

const authorizeRole = (role) => {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(403).json({ message: 'Access denied: Unauthorized role' });
        }
        next();
    };
};

// --- AUTH ENDPOINTS ---
app.post('/api/auth/register', async (req, res) => {
    const { username, password, fullName, email } = req.body;
    if (users.find(u => u.username === username)) {
        return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
        id: Date.now().toString(),
        username,
        password: hashedPassword,
        fullName,
        email,
        role: 'STUDENT'
    };
    users.push(newUser);
    res.status(201).json({ message: 'User registered successfully' });
});

app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
});

// --- ACADEMY ENDPOINTS ---
app.get('/api/academy', (req, res) => {
    res.json({ courses, lessons });
});

// Course Management (Lecturer Only)
app.post('/api/courses', authenticateToken, authorizeRole('LECTURER'), (req, res) => {
    const newCourse = { id: Date.now().toString(), ...req.body };
    courses.push(newCourse);
    res.status(201).json(newCourse);
});

app.put('/api/courses/:id', authenticateToken, authorizeRole('LECTURER'), (req, res) => {
    const { id } = req.params;
    const index = courses.findIndex(c => c.id === id);
    if (index !== -1) {
        courses[index] = { ...courses[index], ...req.body };
        res.json(courses[index]);
    } else {
        res.status(404).json({ message: 'Course not found' });
    }
});

app.delete('/api/courses/:id', authenticateToken, authorizeRole('LECTURER'), (req, res) => {
    const { id } = req.params;
    courses = courses.filter(c => c.id !== id);
    lessons = lessons.filter(l => l.courseId !== id);
    res.status(204).send();
});

// Lesson Management (Lecturer Only)
app.post('/api/lessons', authenticateToken, authorizeRole('LECTURER'), (req, res) => {
    const newLesson = { id: Date.now().toString(), ...req.body };
    lessons.push(newLesson);
    res.status(201).json(newLesson);
});

app.put('/api/lessons/:id', authenticateToken, authorizeRole('LECTURER'), (req, res) => {
    const { id } = req.params;
    const index = lessons.findIndex(l => l.id === id);
    if (index !== -1) {
        lessons[index] = { ...lessons[index], ...req.body };
        res.json(lessons[index]);
    } else {
        res.status(404).json({ message: 'Lesson not found' });
    }
});

app.delete('/api/lessons/:id', authenticateToken, authorizeRole('LECTURER'), (req, res) => {
    const { id } = req.params;
    lessons = lessons.filter(l => l.id !== id);
    res.status(204).send();
});

export default app;
