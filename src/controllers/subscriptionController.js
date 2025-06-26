const SubscriptionService = require('../services/subscriptionService');
const EmailService = require('../services/emailService');

const handleError = require('../utils/errors');

const errorMap = {
    'MISSING REQUIRED FIELDS': { status: 400, message: 'Missing required fields.' },
    'INVALID EMAIL FORMAT': { status: 400, message: 'Invalid email format.' },
    'INVALID FREQUENCY': { status: 400, message: 'Invalid frequency.' },
    'ALREADY CONFIRMED': { status: 400, message: 'Subscription already confirmed' },
    'TOKEN NOT FOUND': { status: 404, message: 'Token not found' },
    'INVALID TOKEN': { status: 400, message: 'Invalid token' },
    'DUPLICATE': { status: 409, message: 'Subscription already exists for this city and frequency.' },
};

const subscribeController = async (req, res) => {
    const { email, city, frequency } = req.body;

    try {
        const token = await SubscriptionService.createSub(email, city, frequency);

        const emailResult = await EmailService.sendConfirmationEmail(email, token);

        if (!emailResult || emailResult.error) {
            return res.status(500).json({ error: 'Subscription saved but failed to send confirmation email.' });
        }

        res.status(200).json({ message: 'Subscription successful. Confirmation email sent.' });

    } catch (err) {
        handleError(err, errorMap, res);
    }
}

const confirmController = async (req, res) => {
    const { token } = req.params;

    try {
        await SubscriptionService.confirmSub(token);
        res.status(200).json({ message: 'Subscription confirmed successfully' });

    } catch (err) {
        handleError(err, errorMap, res);
    }
}

const unsubscribeController = async (req, res) => {
    const { token } = req.params;

    try {
        const sub = await SubscriptionService.deleteSub(token);

        const emailResult = await EmailService.sendUnsubscribeEmail(sub.email, sub.city);

        if (!emailResult || emailResult.error) {
            console.log(`error: ${emailResult.error.message}`);
            return res.status(500).json({ error: 'Unsubscribed, but failed to send confirmation email.' });
        }

        res.status(200).json({ message: 'Unsubscribed successfully'});

    } catch (err) {
        handleError(err, errorMap, res);
    }
}

module.exports = {subscribeController, confirmController, unsubscribeController}