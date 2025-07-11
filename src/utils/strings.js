const crypto = require('crypto');
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function genToken(length = 20) 
{
    return crypto.randomBytes(length).toString('hex');
}

module.exports = { emailRegex, genToken };
