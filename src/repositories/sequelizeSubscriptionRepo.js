const ISubscriptionRepo = require('./subscriptionRepoInterface');
const { Subscription } = require('../db/models');

class SequelizeSubscriptionRepo extends ISubscriptionRepo
{
    async createSub(data)
    {
        const sub = await Subscription.create(data);
        return this.toPlainObject(sub);
    }

    async findSub(params)
    {
        const sub = await Subscription.findOne({ where: params });
        return sub ? this.toPlainObject(sub) : null;
    }

    async confirmSub(token)
    {
        const sub = await Subscription.findOne({ where: { token } });
        if (!sub) return null;
        sub.confirmed = true;
        await sub.save();
        return this.toPlainObject(sub);
    }

    async deleteSub(token)
    {
        const sub = await Subscription.findOne({ where: { token } });
        if (!sub) return false; // Return false if no subscription is found
        await sub.destroy();
        return true; // Return true if the subscription is successfully deleted
    }

    async findAllSubs(params)
    {
        const subs = await Subscription.findAll({ where: params });
        return subs.map(sub => this.toPlainObject(sub));
    }

    async clear()
    {
        await Subscription.destroy({ where: {}, truncate: true, force: true });
    }

    toPlainObject(sub)
    {
        return {
            email: sub.email,
            city: sub.city,
            frequency: sub.frequency,
            confirmed: sub.confirmed,
            token: sub.token
        };
    }
}

module.exports = SequelizeSubscriptionRepo;
