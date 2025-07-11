const { emailRegex, genToken } = require('../utils/strings');

class SubscriptionService
{
    emailService;

    subscriptionRepo;

    constructor(emailService, subscriptionRepo)
    {
        this.emailService = emailService;
        this.subscriptionRepo = subscriptionRepo;
    }

    async subscribeUser(email, city, frequency) 
    {
        if (!email || !city || !frequency) 
        {
            throw new Error('MISSING REQUIRED FIELDS');
        }
        if (!emailRegex.test(email)) 
        {
            throw new Error('INVALID EMAIL FORMAT');
        }
        if (!['hourly', 'daily'].includes(frequency)) 
        {
            throw new Error('INVALID FREQUENCY');
        }
        const exists = await this.subscriptionRepo.findSub({ email, city, frequency });
        if (exists) 
        {
            throw new Error('DUPLICATE');
        }
        const token = genToken();
        await this.subscriptionRepo.createSub({ email, city, frequency, confirmed: false, token });
        const emailResult = await this.emailService.sendConfirmationEmail(email, token);
        if (!emailResult || emailResult.error) 
        {
            throw new Error('EMAIL_FAILED');
        }
        return token;
    }

    async confirmSubscription(token) 
    {
        if (!token || token.length < 10) throw new Error('INVALID TOKEN');
        return await this.subscriptionRepo.confirmSub(token);
    }

    async unsubscribeUser(token) 
    {
        if (!token || token.length < 10) throw new Error('INVALID TOKEN');
        const sub = await this.subscriptionRepo.findSub({ token });
        if (!sub) throw new Error('TOKEN NOT FOUND');
        await this.subscriptionRepo.deleteSub(token);
        const emailResult = await this.emailService.sendUnsubscribeEmail(sub.email, sub.city);
        if (!emailResult || emailResult.error) 
        {
            throw new Error('EMAIL_FAILED');
        }
        return sub;
    }

    async findSub(params) 
    {
        return await this.subscriptionRepo.findSub(params);
    }
}

module.exports = SubscriptionService;
