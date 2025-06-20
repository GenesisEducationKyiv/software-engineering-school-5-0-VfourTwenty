console.log('email mock called');

async function sendEmail(to, subject, body)
{
    return { success: true}
}

module.exports = { sendEmail };