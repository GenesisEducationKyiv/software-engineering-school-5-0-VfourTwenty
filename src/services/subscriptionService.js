const SubscriptionRepo = require('../repositories/sequelizeSubscriptionRepo');
const EmailService = require('../services/emailService');
const { emailRegex, genToken } = require('../utils/strings');

class SubscriptionService {
    static async subscribeUser(email, city, frequency) {
        if (!email || !city || !frequency) {
            throw new Error('MISSING REQUIRED FIELDS');
        }
        if (!emailRegex.test(email)) {
            throw new Error('INVALID EMAIL FORMAT');
        }
        if (!['hourly', 'daily'].includes(frequency)) {
            throw new Error('INVALID FREQUENCY');
        }
        const exists = await SubscriptionRepo.findSub({ email, city, frequency });
        if (exists) {
            throw new Error('DUPLICATE');
        }
        const token = genToken();
        await SubscriptionRepo.createSub({ email, city, frequency, confirmed: false, token });
        const emailResult = await EmailService.sendConfirmationEmail(email, token);
        if (!emailResult || emailResult.error) {
            throw new Error('EMAIL_FAILED');
        }
        return token;
    }

    static async confirmSubscription(token) {
        if (!token || token.length < 10) throw new Error('INVALID TOKEN');
        return await SubscriptionRepo.confirmSub(token);
    }

    static async unsubscribeUser(token) {
        if (!token || token.length < 10) throw new Error('INVALID TOKEN');
        const sub = await SubscriptionRepo.findSub({ token });
        if (!sub) throw new Error('TOKEN NOT FOUND');
        await SubscriptionRepo.deleteSub(token);
        const emailResult = await EmailService.sendUnsubscribeEmail(sub.email, sub.city);
        if (!emailResult || emailResult.error) {
            throw new Error('EMAIL_FAILED');
        }
        return sub;
    }

    static async findSub(params) {
        return await SubscriptionRepo.findSub(params);
    }
}

module.exports = SubscriptionService;
