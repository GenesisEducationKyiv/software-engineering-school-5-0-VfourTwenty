const errorMap = {
    // subscription
    'MISSING REQUIRED FIELDS': { status: 400 },
    'INVALID EMAIL FORMAT': { status: 400 },
    'INVALID CITY': {status: 400 },
    'INVALID FREQUENCY': {status: 400},
    'DUPLICATE': {status: 409},
    'FAILED TO CREATE SUBSCRIPTION': {status: 400},
    // confirmation
    'ALREADY CONFIRMED': {status: 400},
    'CONFIRMATION FAILED': {status: 400},
    // unsubscribe
    'FAILED TO DELETE SUBSCRIPTION': {status: 400},
    // confirm and unsubscribe
    'SUBSCRIPTION NOT FOUND': {status: 400},
    'TOKEN NOT FOUND': {status: 404},
    'INVALID TOKEN': {status: 400}
};

function handleError(err, res, map = errorMap)
{
    const mapped = map[err];
    if (mapped) 
    {
        return res.status(mapped.status).json({ error: err });
    }
    else 
    {
        return res.status(500).json({ error: 'SUBSCRIPTION SERVICE ERROR' });
    }
}


module.exports = { handleError };
