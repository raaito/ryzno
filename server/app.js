import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import connectDB from './config/db.js';
import User from './models/User.js';
import Course from './models/Course.js';
import Lesson from './models/Lesson.js';
import Setting from './models/Setting.js';
import Contact from './models/Contact.js';

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'ryzno_sentinel_secret_key_2026';

// Diagnostic endpoint
app.get(['/api', '/api/ping'], (req, res) => {
    res.json({
        status: 'online',
        timestamp: new Date().toISOString(),
        env: {
            hasMongo: !!process.env.MONGO_URI,
            nodeEnv: process.env.NODE_ENV
        }
    });
});

// Connect to Database
connectDB();

app.use(cors());
app.use(express.json());

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
    try {
        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            id: Date.now().toString(),
            username,
            password: hashedPassword,
            fullName,
            email,
            role: 'STUDENT'
        });
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        await connectDB();
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: `Server error: ${error.message}` });
    }
});

// --- ACADEMY ENDPOINTS ---
app.get('/api/academy', async (req, res) => {
    try {
        const courses = await Course.find({});
        const lessons = await Lesson.find({});
        res.json({ courses, lessons });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching academy content' });
    }
});

// --- BOOK SALE ENDPOINTS ---
app.get('/api/settings/book-sale', async (req, res) => {
    try {
        const setting = await Setting.findOne({ key: 'bookSale' });
        res.json(setting ? setting.value : {});
    } catch (error) {
        res.status(500).json({ message: 'Error fetching settings' });
    }
});

app.put('/api/settings/book-sale', authenticateToken, authorizeRole('LECTURER'), async (req, res) => {
    try {
        const setting = await Setting.findOne({ key: 'bookSale' });
        let updatedValue = req.body;
        if (setting) {
            updatedValue = { ...setting.value, ...req.body };
            setting.value = updatedValue;
            await setting.save();
        } else {
            await Setting.create({ key: 'bookSale', value: req.body });
            updatedValue = req.body;
        }
        res.json(updatedValue);
    } catch (error) {
        res.status(500).json({ message: 'Error updating settings' });
    }
});

// --- ACADEMY AD ENDPOINTS ---
app.get('/api/settings/academy-ad', async (req, res) => {
    try {
        const setting = await Setting.findOne({ key: 'academyAd' });
        res.json(setting ? setting.value : {});
    } catch (error) {
        res.status(500).json({ message: 'Error fetching settings' });
    }
});

app.put('/api/settings/academy-ad', authenticateToken, authorizeRole('LECTURER'), async (req, res) => {
    try {
        const setting = await Setting.findOne({ key: 'academyAd' });
        let updatedValue = req.body;
        if (setting) {
            updatedValue = { ...setting.value, ...req.body };
            setting.value = updatedValue;
            await setting.save();
        } else {
            await Setting.create({ key: 'academyAd', value: req.body });
            updatedValue = req.body;
        }
        res.json(updatedValue);
    } catch (error) {
        res.status(500).json({ message: 'Error updating settings' });
    }
});

// --- WEBHOOK ENDPOINTS ---
app.post('/api/webhooks/selar', async (req, res) => {
    console.log('Received Webhook from Selar:', req.body);
    // In a real scenario, verify the signature here.

    const paymentData = req.body;
    const email = paymentData.email || (paymentData.data && paymentData.data.customer && paymentData.data.customer.email);
    const name = paymentData.name || (paymentData.data && paymentData.data.customer && paymentData.data.customer.name) || 'Student';

    if (!email) {
        return res.status(400).json({ message: 'Invalid payload: No email found' });
    }

    try {
        let user = await User.findOne({ $or: [{ email }, { username: email }] });

        if (!user) {
            // Auto-create user
            const generatedPassword = 'Sentinel2026!'; // Default password
            const hashedPassword = await bcrypt.hash(generatedPassword, 10);

            user = await User.create({
                id: Date.now().toString(),
                username: email,
                password: hashedPassword,
                fullName: name,
                email: email,
                role: 'STUDENT',
                courses: ['wealthy-place']
            });

            console.log(`[AUTOMATION] Created new account for ${email}. Password: ${generatedPassword}`);
            console.log(`[EMAIL SIMULATION] Sending Welcome Email to ${email} with credentials...`);
        } else {
            // Update existing user access
            if (!user.courses.includes('wealthy-place')) {
                user.courses.push('wealthy-place');
                await user.save();
                console.log(`[AUTOMATION] Granted 'The Wealthy Place' access to existing user ${email}`);
            }
        }

        res.status(200).json({ message: 'Webhook processed successfully' });
    } catch (error) {
        console.error('Webhook Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Course Management (Lecturer Only)
app.post('/api/courses', authenticateToken, authorizeRole('LECTURER'), async (req, res) => {
    try {
        const newCourse = await Course.create({ id: Date.now().toString(), ...req.body });
        res.status(201).json(newCourse);
    } catch (error) {
        res.status(500).json({ message: 'Error creating course' });
    }
});

app.put('/api/courses/:id', authenticateToken, authorizeRole('LECTURER'), async (req, res) => {
    const { id } = req.params;
    try {
        const course = await Course.findOneAndUpdate({ id }, req.body, { new: true });
        if (course) {
            res.json(course);
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating course' });
    }
});

app.delete('/api/courses/:id', authenticateToken, authorizeRole('LECTURER'), async (req, res) => {
    const { id } = req.params;
    try {
        await Course.findOneAndDelete({ id });
        await Lesson.deleteMany({ courseId: id });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting course' });
    }
});

// Lesson Management (Lecturer Only)
app.post('/api/lessons', authenticateToken, authorizeRole('LECTURER'), async (req, res) => {
    try {
        const newLesson = await Lesson.create({ id: Date.now().toString(), ...req.body });
        res.status(201).json(newLesson);
    } catch (error) {
        res.status(500).json({ message: 'Error creating lesson' });
    }
});

app.put('/api/lessons/:id', authenticateToken, authorizeRole('LECTURER'), async (req, res) => {
    const { id } = req.params;
    try {
        const lesson = await Lesson.findOneAndUpdate({ id }, req.body, { new: true });
        if (lesson) {
            res.json(lesson);
        } else {
            res.status(404).json({ message: 'Lesson not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating lesson' });
    }
});

app.delete('/api/lessons/:id', authenticateToken, authorizeRole('LECTURER'), async (req, res) => {
    const { id } = req.params;
    try {
        await Lesson.findOneAndDelete({ id });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting lesson' });
    }
});

// --- CONTACT ENDPOINTS ---
app.post('/api/contact', async (req, res) => {
    console.log('Incoming contact request body:', req.body);
    const { name, email, message, source } = req.body;
    if (!name || !email || !message) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    try {
        await Contact.create({
            id: Date.now().toString(),
            name,
            email,
            message,
            source: source || 'General'
        });
        res.status(201).json({ message: 'Message sent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error sending message' });
    }
});

app.get('/api/contact', authenticateToken, authorizeRole('LECTURER'), async (req, res) => {
    try {
        const contacts = await Contact.find({});
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching contacts' });
    }
});

app.delete('/api/contact/:id', authenticateToken, authorizeRole('LECTURER'), async (req, res) => {
    const { id } = req.params;
    try {
        await Contact.findOneAndDelete({ id });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting contact' });
    }
});

export default app;
