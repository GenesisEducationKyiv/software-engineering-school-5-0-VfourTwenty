const errorMap = {
    'MISSING REQUIRED FIELDS': { status: 400, message: 'Missing required fields.' },
    'INVALID EMAIL FORMAT': { status: 400, message: 'Invalid email format.' },
    'INVALID FREQUENCY': { status: 400, message: 'Invalid frequency.' },
    'ALREADY CONFIRMED': { status: 400, message: 'Subscription already confirmed' },
    'TOKEN NOT FOUND': { status: 404, message: 'Token not found' },
    'INVALID TOKEN': { status: 400, message: 'Invalid token' },
    'DUPLICATE': { status: 409, message: 'Subscription already exists for this city and frequency.' },
    'INVALID CITY': { status: 400, message: 'Invalid city.' },
    'CONFIRMATION EMAIL FAILED': { status: 500, message: 'Subscription operation succeeded but failed to send confirmation email.' },
    'NO WEATHER DATA': { status: 404, message: 'No weather data available for this location' }
};

function handleError(err, res, map = errorMap)
{
    const mapped = map[err.message];
    if (mapped) 
    {
        res.status(mapped.status).json({ error: mapped.message });
    }
    else 
    {
        res.status(500).json({ error: err.message });
    }
}

function mapErrorToClientMessage(err, map = errorMap)
{
    return map[err.message].message || null;
}

module.exports = { handleError, mapErrorToClientMessage };
