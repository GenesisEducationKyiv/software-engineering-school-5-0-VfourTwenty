const providerState  = require('../providers/state.js');

async function sendEmail(to, subject, body)
{
    return providerState.activeEmailProvider.sendEmail(to, subject, body);
}

module.exports = { sendEmail }