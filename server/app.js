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
import RestoreRegistration from './models/RestoreRegistration.js';
import { findAvailableSlots, validateAssignments, isSlotAvailable } from './utils/schedulingUtils.js';
import { sendRegistrationConfirmation, sendReassignmentNotification } from './utils/whatsappService.js';
import { sendRestoreConfirmationEmail, sendRestoreReassignmentEmail } from './utils/emailService.js';

import crypto from 'crypto';

const app = express();
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    console.warn('WARNING: JWT_SECRET not found in environment. Auth will fail.');
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
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
    'http://ryzno.test',
    'http://ryzno.local',
    'https://ryzno.vercel.app',
    'https://www.ryzno.com'
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin ||
            allowedOrigins.includes(origin) ||
            origin.startsWith('http://localhost:') ||
            origin.startsWith('http://127.0.0.1:') ||
            origin.endsWith('.vercel.app')
        ) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - Origin: ${req.headers.origin}`);
    next();
});

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
        res.json({ token, user: { id: user.id, username: user.username, email: user.email, role: user.role, mustChangePassword: user.mustChangePassword } });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: `Server error: ${error.message}` });
    }
});

app.post('/api/auth/change-password', authenticateToken, async (req, res) => {
    const { newPassword } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.findOneAndUpdate(
            { id: req.user.id },
            { password: hashedPassword, mustChangePassword: false }
        );
        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating password' });
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

        const tryEndpoints = [
            `https://api.selar.co/v1/checkout/all-sales?email=${encodeURIComponent(email)}`,
            `https://api.selar.co/v1/sales?email=${encodeURIComponent(email)}`
        ];

        let hasPurchased = false;
        let lastStatus = 0;

        for (const endpoint of tryEndpoints) {
            console.log(`[ONBOARDING] Trying Selar endpoint: ${endpoint}`);
            const selarRes = await fetch(endpoint, {
                headers: { 'Authorization': `Bearer ${process.env.SELAR_API_KEY}` }
            });

            if (selarRes.ok) {
                const data = await selarRes.json();
                console.log(`[ONBOARDING] Selar API Response (${endpoint}):`, JSON.stringify(data, null, 2));
                const sales = data.data || [];
                hasPurchased = sales.some(sale =>
                    (sale.product_name && sale.product_name.toLowerCase().includes('wealthy place')) ||
                    (sale.product_id && sale.product_id.toString().includes('wealthy-place'))
                );
                if (hasPurchased) break;
            } else {
                lastStatus = selarRes.status;
                const errorBody = await selarRes.text().catch(() => '');
                console.error(`Selar endpoint failed (${endpoint}): ${selarRes.status} ${errorBody}`);
            }
        }

        if (!hasPurchased) {
            const msg = lastStatus === 401 ? 'Invalid Selar API Key. Please check your Vercel environment variables.' :
                lastStatus === 404 ? 'No record found on Selar for this email. Ensure you used the same email for payment.' :
                    'Could not verify purchase with Selar. Please try again or contact support.';
            return res.status(lastStatus === 401 ? 401 : 403).json({ message: msg });
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
            const errorText = await selarRes.text().catch(() => 'No error body');
            console.error(`Selar API error (${selarRes.status}):`, errorText);
            return res.status(500).json({ message: `Selar API error: ${selarRes.status}` });
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

app.get('/api/restore/availability', async (req, res) => {
    const { duration } = req.query;
    try {
        const assignments = await findAvailableSlots(parseInt(duration) || 1);
        res.json(assignments);
    } catch (error) {
        res.status(500).json({ message: 'Error checking availability' });
    }
});

app.get('/api/restore/check-record', async (req, res) => {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: 'Email is required' });
    try {
        const registration = await RestoreRegistration.findOne({ email }).sort({ createdAt: -1 });
        if (registration) {
            res.json({ found: true, registration });
        } else {
            res.json({ found: false });
        }
    } catch (error) {
        console.error('RESTORE REGISTRATION ERROR:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

app.get('/api/restore/availability', authenticateToken, authorizeRole('LECTURER'), async (req, res) => {
    const { duration } = req.query;
    try {
        const assignments = await findAvailableSlots(parseInt(duration) || 1);
        res.json(assignments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching availability' });
    }
});

app.get('/api/restore/my-registrations', authenticateToken, async (req, res) => {
    try {
        const registrations = await RestoreRegistration.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(registrations);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching registrations' });
    }
});

app.post('/api/restore/register', async (req, res) => {
    console.log('Incoming Restore registration:', req.body);
    try {
        const { requestedDuration, feeAgreement, paymentPromise, paymentDate } = req.body;

        let status = 'pending';
        let assignments = [];

        if (feeAgreement) {
            assignments = await findAvailableSlots(requestedDuration || 1);
            status = 'scheduled';
        } else if (paymentPromise) {
            status = 'promised';
        } else {
            status = 'incomplete';
        }

        // Automatic User Creation
        const { email, firstName, surname } = req.body;
        let user = await User.findOne({ email });
        let credentials = null;

        if (!user) {
            const tempUsername = email.split('@')[0].toLowerCase();
            // Check if username unique, appending random if not
            let finalUsername = tempUsername;
            const existingUsername = await User.findOne({ username: finalUsername });
            if (existingUsername) {
                finalUsername = `${tempUsername}${Math.floor(1000 + Math.random() * 9000)}`;
            }

            const tempPassword = `RYZ-${Math.floor(100000 + Math.random() * 900000)}`; // Safe default
            const hashedPassword = await bcrypt.hash(tempPassword, 10);

            user = await User.create({
                id: crypto.randomUUID(),
                username: finalUsername,
                password: hashedPassword,
                fullName: `${firstName} ${surname}`,
                email: email,
                role: 'CLIENT',
                mustChangePassword: true
            });

            credentials = { username: finalUsername, password: tempPassword };
        }

        const registration = await RestoreRegistration.create({
            id: crypto.randomUUID(),
            ...req.body,
            countryCode: req.body.countryCode || '+234', // Ensure fallback
            assignments,
            status,
            userId: user.id
        });

        if (status === 'scheduled') {
            // Send dual-channel notifications only if scheduled
            await sendRestoreConfirmationEmail(registration, credentials);
            await sendRegistrationConfirmation(registration, credentials);
        } else if (credentials) {
            // Even if not scheduled, if a new user was created, we should inform them?
            // For now, let's keep it consistent: send basic "Account Created" if it's new
            // But usually, Restore users are the main focus.
            // Let's passed credentials to services if they exist.
        }

        res.status(201).json({
            success: true,
            message: status === 'scheduled'
                ? 'Registration submitted and scheduled successfully!'
                : (status === 'promised' ? 'Payment promise recorded. We will remind you!' : 'Registration saved. Contact us when ready to book.'),
            registrationId: registration.id,
            assignments,
            status
        });
    } catch (error) {
        console.error('RESTORE REGISTRATION ERROR:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

app.post('/api/restore/registrations/:id/reassign', authenticateToken, authorizeRole('LECTURER'), async (req, res) => {
    const { id } = req.params;
    const { assignments, reason } = req.body;

    if (!reason || !assignments || !assignments.length) {
        return res.status(400).json({ message: 'Assignments and a reason are required for reassignment.' });
    }

    try {
        const registration = await RestoreRegistration.findOne({ id });
        if (!registration) return res.status(404).json({ message: 'Registration not found' });

        // Check for conflicts
        const isFree = await validateAssignments(assignments, id);
        if (!isFree) {
            return res.status(409).json({ message: 'Conflict detected: One or more slots are already occupied. Please move the other appointment or pick a different slot.' });
        }

        const oldAssignments = [...registration.assignments];
        registration.assignments = assignments;
        registration.reassignmentHistory.push({
            reason,
            oldAssignments
        });
        registration.status = 'scheduled';

        await registration.save();

        // Notify user via Email and WhatsApp
        await sendRestoreReassignmentEmail(registration, reason);
        await sendReassignmentNotification(registration, reason);

        res.json({ success: true, message: 'Session reassigned and notifications sent.', registration });
    } catch (error) {
        console.error('Reassignment Error:', error);
        res.status(500).json({ message: 'Error reassigning session' });
    }
});

app.get('/api/restore/registrations', authenticateToken, authorizeRole('LECTURER'), async (req, res) => {
    try {
        const registrations = await RestoreRegistration.find({}).sort({ createdAt: -1 });
        res.json(registrations);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching registrations' });
    }
});

app.put('/api/restore/registrations/:id', authenticateToken, authorizeRole('LECTURER'), async (req, res) => {
    const { id } = req.params;
    try {
        const registration = await RestoreRegistration.findOneAndUpdate({ id }, req.body, { new: true });
        if (registration) {
            res.json(registration);
        } else {
            res.status(404).json({ message: 'Registration not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating registration' });
    }
});

app.delete('/api/restore/registrations/:id', authenticateToken, authorizeRole('LECTURER'), async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await RestoreRegistration.findOneAndDelete({ id });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Registration not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting registration' });
    }
});

// --- USER MANAGEMENT ENDPOINTS ---
app.get('/api/users', authenticateToken, authorizeRole('LECTURER'), async (req, res) => {
    try {
        const users = await User.find({}, '-password').sort({ fullName: 1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
});

app.put('/api/users/:id/role', authenticateToken, authorizeRole('LECTURER'), async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;
    try {
        const user = await User.findOneAndUpdate({ id }, { role }, { new: true });
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating user role' });
    }
});

app.delete('/api/users/:id', authenticateToken, authorizeRole('LECTURER'), async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await User.findOneAndDelete({ id });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user' });
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
