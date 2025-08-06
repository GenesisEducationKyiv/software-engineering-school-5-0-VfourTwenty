const errorMap = {
    // subscription
    'MISSING REQUIRED FIELDS': 400,
    'INVALID EMAIL FORMAT': 400,
    'INVALID CITY': 400,
    'INVALID FREQUENCY': 400,
    'DUPLICATE': 409,
    'FAILED TO CREATE SUBSCRIPTION': 400,
    // confirmation
    'ALREADY CONFIRMED': 400,
    'CONFIRMATION FAILED': 400,
    // unsubscribe
    'FAILED TO DELETE SUBSCRIPTION': 400,
    // confirm and unsubscribe
    'SUBSCRIPTION NOT FOUND': 400,
    'TOKEN NOT FOUND': 404,
    'INVALID TOKEN': 400
};

function handleError(err, res, map = errorMap)
{
    const status= map[err];
    if (status)
    {
        return res.status(status).json({ error: err });
    }
    else 
    {
        return res.status(500).json({ error: 'SUBSCRIPTION SERVICE ERROR' });
    }
}


module.exports = { handleError };
