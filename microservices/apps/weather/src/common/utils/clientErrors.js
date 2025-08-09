const errorMap = {
    'NO CITY PROVIDED': 400,
    'INVALID WEATHER DATA FORMAT': 404,
    'NO WEATHER DATA': 404,
};

function handleError(err, res, map = errorMap)
{
    const status = map[err];
    if (status)
    {
        return res.status(status).json({ error: err });
    }
    else 
    {
        return res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = { handleError };
