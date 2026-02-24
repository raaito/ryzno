/**
 * Email Service Simulation
 * In production, this would use nodemailer with an SMTP transport or a service like SendGrid/Mailgun.
 */

export const sendEmail = async (to, subject, html) => {
    // Simulated email sending
    console.log('---------------------------------------------------------');
    console.log(`[EMAIL SIMULATION] TO: ${to}`);
    console.log(`[EMAIL SIMULATION] SUBJECT: ${subject}`);
    console.log(`[EMAIL SIMULATION] BODY (HTML): (Sent ${html.length} chars)`);
    console.log('---------------------------------------------------------');

    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
};

export const sendRestoreConfirmationEmail = async (data, credentials = null) => {
    const { firstName, email, assignments } = data;

    let scheduleHtml = assignments.map(a => {
        const dateStr = new Date(a.date).toLocaleDateString('en-GB', {
            weekday: 'long',
            day: 'numeric',
            month: 'long'
        });
        return `<li><strong>${dateStr}</strong> at <strong>${a.startTime}</strong></li>`;
    }).join('');

    const html = `
        <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 12px, overflow: hidden;">
            <div style="background: #ef4444; color: white; padding: 20px; text-align: center;">
                <h1>RESTORE for Ryznovation</h1>
            </div>
            <div style="padding: 30px;">
                <h2>Hello ${firstName}!</h2>
                <p>Your registration for a restoration session has been received.</p>
                <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
                    <p style="margin-top: 0;"><strong>Your Assigned Schedule:</strong></p>
                    <ul>${scheduleHtml}</ul>
                </div>
                <p>Please ensure you are available for these times as we have reserved them specifically for you.</p>
                ${credentials ? `
                <div style="background: #eef2ff; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #4f46e5;">
                    <p style="margin-top: 0; color: #4f46e5;"><strong>🔐 Your Secure Account Access:</strong></p>
                    <p>We have created a standalone profile for you to track your session reports, summaries, and resources.</p>
                    <p><strong>Username:</strong> ${credentials.username}<br>
                    <strong>Default Password:</strong> ${credentials.password}</p>
                    <p style="font-size: 0.9rem; color: #666;"><em>Note: Please log in and change your password immediately for security.</em></p>
                    <div style="text-align: center; margin-top: 15px;">
                        <a href="https://ryzno.com/login" style="background: #000; color: #fff; padding: 12px 25px; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 0.9rem;">Login to Your Profile</a>
                    </div>
                </div>
                ` : ''}
                <p>If you have any questions, feel free to reach out to us on WhatsApp.</p>
                <br>
                <p>Warm regards,<br>The Ryzno Team</p>
            </div>
        </div>
    `;

    return await sendEmail(email, 'RESTORE Session Confirmation - Ryzno', html);
};

export const sendRestoreReassignmentEmail = async (data, reason) => {
    const { firstName, email, assignments } = data;

    let scheduleHtml = assignments.map(a => {
        const dateStr = new Date(a.date).toLocaleDateString('en-GB', {
            weekday: 'long',
            day: 'numeric',
            month: 'long'
        });
        return `<li><strong>${dateStr}</strong> at <strong>${a.startTime}</strong></li>`;
    }).join('');

    const html = `
        <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 12px;">
            <div style="background: #000; color: white; padding: 20px; text-align: center;">
                <h1>RESTORE Update</h1>
            </div>
            <div style="padding: 30px;">
                <h2>Hi ${firstName},</h2>
                <p>We have an update regarding your scheduled RESTORE session. Due to scheduling requirements, we have reassigned your session.</p>
                <div style="background: #fff4f4; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #ef4444;">
                    <p><strong>Reason for Reassignment:</strong></p>
                    <p style="font-style: italic;">"${reason}"</p>
                </div>
                <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #000;">
                    <p style="margin-top: 0;"><strong>Your New Schedule:</strong></p>
                    <ul>${scheduleHtml}</ul>
                </div>
                <p>We apologize for this change and hope these new times work for you. If not, please contact us immediately.</p>
                <br>
                <p>Best,<br>The Ryzno Team</p>
            </div>
        </div>
    `;

    return await sendEmail(email, 'Important: Your RESTORE Session has been Reassigned', html);
};
