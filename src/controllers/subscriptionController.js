const { createSub, confirmSub, deleteSub } = require('../services/subscriptionService');
const { sendConfirmationEmail, sendUnsubscribeEmail } = require('../utils/mailer');

const subscribeController = async (req, res) => {
    const { email, city, frequency } = req.body;

    try {
        const token = await createSub(email, city, frequency);

        const env = process.env.NODE_ENV;
        const config = require('../config/config.js')[env];

        const confirmUrl = `${config.baseUrl}/confirm/${token}`;

        const emailResult = await sendConfirmationEmail(email, confirmUrl);

        if (!emailResult || emailResult.error) {
            return res.status(500).json({ error: 'Subscription saved but failed to send confirmation email.' });
        }

        res.status(200).json({ message: 'Subscription successful. Confirmation email sent.' });

    } catch (err) {
        if (err.message === 'DUPLICATE')
        {
            res.status(409).json({error: 'Subscription already exists for this city and frequency.'});
        }
        else if (err.message === 'MISSING REQUIRED FIELDS')
        {
            res.status(400).json({error: 'Missing required fields.'});
        }
        else if (err.message === 'INVALID EMAIL FORMAT')
        {
            res.status(400).json({error: 'Invalid email format.'});
        }
        else if (err.message === 'INVALID FREQUENCY')
        {
            res.status(400).json({error: 'Invalid frequency.'});
        }
        else
        {
            err.message
            res.status(500).json({ error: `Failed to subscribe: ${err.message}` });
        }
    }
}

const confirmController = async (req, res) => {
    const { token } = req.params;

    try {
        await confirmSub(token);
        res.status(200).json({ message: 'Subscription confirmed successfully' });

    } catch (err) {
        if (err.message === 'INVALID TOKEN')
        {
            res.status(400).json({error: 'Invalid token'});
        }
        else if (err.message === 'TOKEN NOT FOUND')
        {
            res.status(404).json({error: 'Token not found'});
        }
        else if (err.message === 'ALREADY CONFIRMED')
        {
            res.status(400).json({error: 'Subscription already confirmed'});
        }
        else
        {
            res.status(500).json({ error: 'Failed to confirm subscription' });
        }
    }
}

const unsubscribeController = async (req, res) => {
    const { token } = req.params;

    try {
        const sub = await deleteSub(token);

        const emailResult = await sendUnsubscribeEmail(sub.email, sub.city);

        if (!emailResult || emailResult.error) {
            console.log(`error: ${emailResult.error.message}`);
            return res.status(500).json({ error: 'Unsubscribed, but failed to send confirmation email.' });
        }

        res.status(200).json({ message: 'Unsubscribed successfully'});

    } catch (err) {
        if (err.message === 'INVALID TOKEN')
        {
            res.status(400).json({error: 'Invalid token'});
        }
        else if (err.message === 'TOKEN NOT FOUND')
        {
            res.status(404).json({error: 'Token not found'});
        }
        else
        {
            res.status(500).json({ error: 'Failed to unsubscribe' });
        }
    }
}

module.exports = {subscribeController, confirmController, unsubscribeController}