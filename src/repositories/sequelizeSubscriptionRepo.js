const ISubscriptionRepo = require('./subscriptionRepoInterface');
const Result = require('../domain/types/result');
const { Subscription } = require('../db/models');

class SequelizeSubscriptionRepo extends ISubscriptionRepo
{
    async createSub(data)
    {
        try
        {
            await Subscription.create(data);
            return new Result(true);
        }
        catch (error)
        {
            return new Result(false, error.message);
        }
    }

    async findSub(params)
    {
        const sub = await Subscription.findOne({ where: params });
        if (!sub) return new Result(false, 'Subscription not found');
        return new Result(true, null, this.toPlainObject(sub));
    }

    async confirmSub(token)
    {
        try
        {
            const sub = await Subscription.findOne({ where: { token } });
            if (!sub) return new Result(false, 'Subscription not found');
            sub.confirmed = true;
            await sub.save();
            return new Result(true);
        }
        catch (error)
        {
            return new Result(false, error.message);
        }
    }

    async deleteSub(token)
    {
        try 
        {
            const sub = await Subscription.findOne({ where: { token } });
            if (!sub) return new Result(false, 'Subscription not found');
            await sub.destroy();
            return new Result(true);
        }
        catch (error) 
        {
            return new Result(false, error.message);
        }
    }

    async findAllSubs(params)
    {
        const subs = await Subscription.findAll({ where: params });
        // may happen in cron handler
        if (!subs) return new Result(false, 'failed to find subscriptions by given params');
        const subObjects = subs.map(sub => this.toPlainObject(sub));
        return new Result(true, null, subObjects);
    }

    async clear()
    {
        try
        {
            await Subscription.destroy({ where: {}, truncate: true, force: true });
            return new Result(true);
        }
        catch (error)
        {
            return new Result(false, error.message);
        }
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
