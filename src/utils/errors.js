function handleError(err, map, res) {
    const mapped = map[err.message];
    if (mapped) {
        res.status(mapped.status).json({ error: mapped.message });
    } else {
        res.status(500).json({ error: err.message });
    }
}

module.exports = handleError;