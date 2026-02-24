/**
 * WhatsApp Service Simulation
 * In a real-world scenario, this would use a provider like Twilio, Meta Business API, or a local WhatsApp gateway.
 */

export const sendWhatsAppMessage = async (phoneNumber, message) => {
    // Basic validation
    if (!phoneNumber) {
        console.warn('[WHATSAPP SIMULATION] No phone number provided. Message not sent.');
        return false;
    }

    console.log('---------------------------------------------------------');
    console.log(`[WHATSAPP SIMULATION] TO: ${phoneNumber}`);
    console.log(`[WHATSAPP SIMULATION] MESSAGE: ${message}`);
    console.log('---------------------------------------------------------');

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return true;
};

/**
 * Sends a registration confirmation message.
 */
export const sendRegistrationConfirmation = async (data) => {
    const { firstName, countryCode, phoneNumber, assignments } = data;
    const fullNumber = `${countryCode || '+234'}${phoneNumber}`;

    let scheduleText = assignments.map(a => {
        const dateStr = new Date(a.date).toLocaleDateString('en-GB', {
            weekday: 'long',
            day: 'numeric',
            month: 'long'
        });
        return `• ${dateStr} @ ${a.startTime}`;
    }).join('\n');

    const message = `Hello ${firstName}! 🌟 

Your RESTORE for Ryznovation registration has been received. 

Based on our current availability, your session has been scheduled for:
${scheduleText}

Please ensure you are available at these times. We have also sent a confirmation to your email.

We look forward to beginning this journey of renovation with you!`;

    return await sendWhatsAppMessage(fullNumber, message);
};

/**
 * Sends a reassignment notification.
 */
export const sendReassignmentNotification = async (data, reason) => {
    const { firstName, countryCode, phoneNumber, assignments } = data;
    const fullNumber = `${countryCode || '+234'}${phoneNumber}`;

    let scheduleText = assignments.map(a => {
        const dateStr = new Date(a.date).toLocaleDateString('en-GB', {
            weekday: 'long',
            day: 'numeric',
            month: 'long'
        });
        return `• ${dateStr} @ ${a.startTime}`;
    }).join('\n');

    const message = `Hi ${firstName}, 

Important update regarding your RESTORE session. We have had to reassign your appointment for the following reason:

"${reason}"

Your new schedule is:
${scheduleText}

We apologize for any inconvenience. If this doesn't work for you, please let us know immediately!`;

    return await sendWhatsAppMessage(fullNumber, message);
};
