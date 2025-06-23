console.log('email service mock called');

async function sendEmail(to, subject, body)
{
    if (to !== 'thisemailshouldfail@mail.com')
    {
        return { success: true }
    }
    return { success: false }
}

module.exports = { sendEmail };