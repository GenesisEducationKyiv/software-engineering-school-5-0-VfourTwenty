const crypto = require('crypto');
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeString(str)
{
    return str
        .normalize('NFD')                                         // Decompose accented characters into base + diacritic (e.g., "ã" → "a" + "~")
        .replace(/[\u0300-\u036f]/g, '')                          // Remove diacritic marks (accents)
        .trim()                                                   // Remove leading/trailing whitespace
        .toLowerCase()                                            // Convert to lowercase
        .replace(/\s+/g, '_')               // Replace all whitespace sequences with a single underscore
        .replace(/[^a-z0-9_]/g, '');        // Remove all non-alphanumeric/underscore characters
}

function genToken(length = 20) 
{
    return crypto.randomBytes(length).toString('hex');
}

module.exports = { emailRegex, genToken, normalizeString };
