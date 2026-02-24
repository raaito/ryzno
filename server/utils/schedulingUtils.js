import RestoreRegistration from '../models/RestoreRegistration.js';

const SLOTS = [
    { start: '18:00', end: '19:00' },
    { start: '19:00', end: '20:00' },
    { start: '20:00', end: '21:00' }
];

const AVAILABLE_DAYS = [1, 2, 3, 5]; // Mon, Tue, Wed, Fri

/**
 * Checks if a specific slot on a specific date is already booked.
 */
export const isSlotAvailable = async (date, startTime, excludeId = null) => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const query = {
        'assignments.date': { $gte: startOfDay, $lte: endOfDay },
        'assignments.startTime': startTime,
        status: { $nin: ['cancelled'] }
    };

    if (excludeId) {
        query.id = { $ne: excludeId };
    }

    const existing = await RestoreRegistration.findOne(query);
    return !existing;
};

/**
 * Finds the earliest available slots for a given duration.
 * Can split across days if needed.
 */
export const findAvailableSlots = async (requestedDuration) => {
    let assignments = [];
    let slotsFound = 0;

    // Start searching from today if it's before the first slot, otherwise tomorrow
    let currentDate = new Date();
    const currentHour = currentDate.getHours();

    // If it's already past the first slot (18:00), start from tomorrow
    if (currentHour >= 18) {
        currentDate.setDate(currentDate.getDate() + 1);
    }
    currentDate.setHours(0, 0, 0, 0);

    // Limit search to next 30 days to avoid infinite loops if fully booked
    for (let i = 0; i < 30 && slotsFound < requestedDuration; i++) {
        const dayOfWeek = currentDate.getDay();

        if (AVAILABLE_DAYS.includes(dayOfWeek)) {
            // Check each slot for this day
            for (const slot of SLOTS) {
                if (slotsFound < requestedDuration) {
                    const available = await isSlotAvailable(currentDate, slot.start);
                    if (available) {
                        assignments.push({
                            date: new Date(currentDate),
                            startTime: slot.start,
                            endTime: slot.end
                        });
                        slotsFound++;
                    }
                }
            }
        }

        // Move to next day
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return assignments;
};

/**
 * Validates a set of assignments for a specific registration.
 * Returns true if all slots are available, false otherwise.
 */
export const validateAssignments = async (assignments, excludeId = null) => {
    for (const assignment of assignments) {
        const available = await isSlotAvailable(assignment.date, assignment.startTime, excludeId);
        if (!available) return false;
    }
    return true;
};
