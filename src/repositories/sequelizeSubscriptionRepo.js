const ISubscriptionRepo = require('./subscriptionRepoInterface');
const DTO = require('../types/dto');
const { Subscription } = require('../db/models');

class SequelizeSubscriptionRepo extends ISubscriptionRepo
{
    async createSub(data)
    {
        try
        {
            await Subscription.create(data);
            return new DTO(true, '');
        }
        catch (error)
        {
            return new DTO(false, error.message);
        }
    }

    async findSub(params)
    {
        const sub = await Subscription.findOne({ where: params });
        return sub ? this.toPlainObject(sub) : null;
    }

    async confirmSub(token)
    {
        try
        {
            const sub = await Subscription.findOne({ where: { token } });
            if (!sub) return new DTO(false, 'Subscription not found');
            sub.confirmed = true;
            await sub.save();
            return new DTO(true, '');
        }
        catch (error)
        {
            return new DTO(false, error.message);
        }
    }

    async deleteSub(token)
    {
        try 
        {
            const sub = await Subscription.findOne({ where: { token } });
            if (!sub) return new DTO(false, 'Subscription not found');
            await sub.destroy();
            return new DTO(true, '');
        }
        catch (error) 
        {
            return new DTO(false, error.message);
        }
    }

    async findAllSubs(params)
    {
        const subs = await Subscription.findAll({ where: params });
        return subs.map(sub => this.toPlainObject(sub));
    }

    async clear()
    {
        try
        {
            await Subscription.destroy({ where: {}, truncate: true, force: true });
            return new DTO(true, '');
        }
        catch (error)
        {
            return new DTO(false, error.message);
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
