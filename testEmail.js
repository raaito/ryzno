import dotenv from 'dotenv';
import { sendEmail } from './server/utils/emailService.js';

dotenv.config();

async function test() {
    console.log('Testing email service...');
    const success = await sendEmail(
        'theryznotrybe@gmail.com', // Sending to the same address for testing
        'Test Email from Ryzno',
        '<h1>Success!</h1><p>Your email system is now live and working via Nodemailer!</p>'
    );

    if (success) {
        console.log('Test email sent successfully! Please check your inbox (theryznotrybe@gmail.com).');
    } else {
        console.error('Test email failed to send. Check the console for errors.');
    }
    
    // Process exit to close the connection
    process.exit(success ? 0 : 1);
}

test();
