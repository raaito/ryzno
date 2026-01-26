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

import crypto from 'crypto';

const app = express();
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    console.error('CRITICAL ERROR: JWT_SECRET not found in environment');
    process.exit(1);
}

// Secure Health Check (Internal Use Only)
app.get('/api/health', (req, res) => {
    res.json({
        status: 'online',
        timestamp: new Date().toISOString()
    });
});

// Connect to Database
connectDB();

// Restricted CORS configuration
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://ryzno.vercel.app',
    'https://www.ryzno.com' // Adjust as needed
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
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
            id: crypto.randomUUID(),
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
        const token = jwt.sign({ id: user.id, username: user.username, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ token, user: { id: user.id, username: user.username, email: user.email, role: user.role } });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: `Server error: ${error.message}` });
    }
});

app.post('/api/auth/register-success', async (req, res) => {
    const { username, password, fullName, email } = req.body;

    if (!username || !password || !fullName || !email) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const userExists = await User.findOne({ $or: [{ username }, { email }] });
        if (userExists) {
            return res.status(400).json({ message: 'User or Email already registered. Please login.' });
        }

        console.log(`[ONBOARDING] Verifying Selar purchase for ${email}...`);

        const selarRes = await fetch(`https://api.selar.co/v1/checkout/all-sales?email=${encodeURIComponent(email)}`, {
            headers: { 'Authorization': `Bearer ${process.env.SELAR_API_KEY}` }
        });

        if (!selarRes.ok) {
            console.error('Selar verification failed during onboarding');
            return res.status(500).json({ message: 'Could not verify purchase with Selar API. Please try again later.' });
        }

        const data = await selarRes.json();
        const sales = data.data || [];
        const hasPurchased = sales.some(sale =>
            (sale.product_name && sale.product_name.toLowerCase().includes('wealthy place')) ||
            (sale.product_id && sale.product_id.toString().includes('wealthy-place'))
        );

        if (!hasPurchased) {
            return res.status(403).json({ message: 'No purchase record found for this email on Selar. Please ensure you use the same email used for payment.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            id: crypto.randomUUID(),
            username,
            password: hashedPassword,
            fullName,
            email,
            role: 'STUDENT',
            courses: ['wealthy-place']
        });

        console.log(`[ONBOARDING] Account created for ${email}. Access granted.`);
        console.log(`[EMAIL SIMULATION] To: ${email} | Subject: Welcome to RYZNO | Body: Your login details: User: ${username}, Pass: ${password}`);

        res.status(201).json({ message: 'Account created and access granted! Redirecting to login...' });
    } catch (error) {
        console.error('Onboarding Error:', error);
        res.status(500).json({ message: 'Server error during account creation.' });
    }
});

// --- SELAR DIRECT SYNC ENDPOINT ---
app.get('/api/auth/sync-selar', authenticateToken, async (req, res) => {
    const userEmail = req.user.email;
    if (!userEmail) return res.status(400).json({ message: 'User email not found in token' });

    console.log(`[SYNC] Checking Selar for purchases by ${userEmail}...`);

    try {
        // Using the sat_ token provided in the Authorization header as a Bearer token
        const selarRes = await fetch(`https://api.selar.co/v1/checkout/all-sales?email=${encodeURIComponent(userEmail)}`, {
            headers: { 'Authorization': `Bearer ${process.env.SELAR_API_KEY}` }
        });

        if (!selarRes.ok) {
            const errorText = await selarRes.text();
            console.error(`Selar API error (${selarRes.status}):`, errorText);
            throw new Error(`Selar API error: ${selarRes.status}`);
        }

        const data = await selarRes.json();
        // Selar's documentation says 'data' contains the collection of transactions
        const sales = data.data || [];

        // Check if any sale corresponds to 'The Wealthy Place'
        const hasPurchased = sales.some(sale =>
            (sale.product_name && sale.product_name.toLowerCase().includes('wealthy place')) ||
            (sale.product_id && sale.product_id.toString().includes('wealthy-place'))
        );

        if (hasPurchased) {
            const user = await User.findOne({ email: userEmail });
            if (user) {
                if (!user.courses.includes('wealthy-place')) {
                    user.courses.push('wealthy-place');
                    await user.save();
                    return res.json({ success: true, message: 'Success! "The Wealthy Place" has been added to your dashboard.' });
                }
                return res.json({ success: true, message: 'Course already exists in your account.' });
            }
        }

        res.status(404).json({ message: 'No matching purchase found on Selar for this email. If you just paid, please wait a minute and try again.' });
    } catch (error) {
        console.error('Sync error:', error);
        res.status(500).json({ message: `Sync error: ${error.message}` });
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
                id: crypto.randomUUID(),
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
        const newCourse = await Course.create({ id: crypto.randomUUID(), ...req.body });
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
        const newLesson = await Lesson.create({ id: crypto.randomUUID(), ...req.body });
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
            id: crypto.randomUUID(),
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
