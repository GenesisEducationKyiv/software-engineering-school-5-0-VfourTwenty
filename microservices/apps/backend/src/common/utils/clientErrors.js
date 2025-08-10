const errorMap = {
    // subscription
    'MISSING REQUIRED FIELDS': { status: 400, message: 'Missing required fields.' },
    'INVALID EMAIL FORMAT': { status: 400, message: 'Invalid email format.' },
    'INVALID CITY': { status: 400, message: 'Invalid city.' },
    'INVALID FREQUENCY': { status: 400, message: 'Invalid frequency.' },
    'DUPLICATE': { status: 409, message: 'Subscription already exists for this city and frequency.' },
    'FAILED TO CREATE SUBSCRIPTION': { status: 400, message: 'Failed to create subscription' },
    'SUBSCRIBED BUT CONFIRM EMAIL FAILED': { status: 500, message: 'Subscription operation succeeded but failed to send confirmation email.' },
    // confirmation
    'ALREADY CONFIRMED': { status: 400, message: 'Subscription already confirmed' },
    'CONFIRMATION FAILED': { status: 400, message: 'Confirmation failed' },
    // unsubscribe
    'FAILED TO DELETE SUBSCRIPTION': { status: 400, message: 'Failed to delete subscription' },
    'UNSUBSCRIBED BUT EMAIL FAILED': { status: 500, message: 'Subscription deleted successfully but failed to send unsubscribed email.' },
    // confirm and unsubscribe
    'SUBSCRIPTION NOT FOUND': { status: 400, message: 'Subscription not found' },
    'TOKEN NOT FOUND': { status: 404, message: 'Token not found' },
    'INVALID TOKEN': { status: 400, message: 'Invalid token' },
    // weather
    'NO CITY PROVIDED': { status: 400, message: 'City is a required field' },
    'INVALID WEATHER DATA FORMAT': { status: 404, message: 'Invalid weather data format' },
    'NO WEATHER DATA': { status: 404, message: 'No weather data available for this location' },
};

function handleError(err, res, map = errorMap)
{
    const mapped = map[err];
    if (mapped) 
    {
        return res.status(mapped.status).json({ error: mapped.message });
    }
    else 
    {
        return res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = { handleError };
