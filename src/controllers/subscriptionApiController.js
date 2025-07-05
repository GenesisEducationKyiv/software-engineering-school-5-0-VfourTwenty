const SubscriptionService = require('../services/subscriptionService');
const validateCity = require('../validators/validateCity');
const handleError = require('../utils/errors');

const errorMap = {
    'MISSING REQUIRED FIELDS': { status: 400, message: 'Missing required fields.' },
    'INVALID EMAIL FORMAT': { status: 400, message: 'Invalid email format.' },
    'INVALID FREQUENCY': { status: 400, message: 'Invalid frequency.' },
    'ALREADY CONFIRMED': { status: 400, message: 'Subscription already confirmed' },
    'TOKEN NOT FOUND': { status: 404, message: 'Token not found' },
    'INVALID TOKEN': { status: 400, message: 'Invalid token' },
    'DUPLICATE': { status: 409, message: 'Subscription already exists for this city and frequency.' },
    'INVALID CITY': { status: 400, message: 'Invalid city.' },
    'EMAIL_FAILED': { status: 500, message: 'Subscription operation succeeded but failed to send email.' },
};

class SubscriptionApiController {
    static async subscribe(req, res) {
        const { email, city, frequency } = req.body;
        try {
            // do this in routes
            await validateCity(city);
            await SubscriptionService.subscribeUser(email, city, frequency);
            res.status(200).json({ message: 'Subscription successful. Confirmation email sent.' });
        } catch (err) {
            handleError(err, errorMap, res);
        }
    }

    static async confirm(req, res) {
        const { token } = req.params;
        try {
            await SubscriptionService.confirmSubscription(token);
            res.status(200).json({ message: 'Subscription confirmed successfully' });
        } catch (err) {
            handleError(err, errorMap, res);
        }
    }

    static async unsubscribe(req, res) {
        const { token } = req.params;
        try {
            await SubscriptionService.unsubscribeUser(token);
            res.status(200).json({ message: 'Unsubscribed successfully'});
        } catch (err) {
            handleError(err, errorMap, res);
        }
    }
}

module.exports = SubscriptionApiController;