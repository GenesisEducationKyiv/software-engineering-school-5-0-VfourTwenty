const ISubscriptionRepo = require('./subscriptionRepoInterface');
const { Subscription } = require('../db/models');

/**
 * @typedef {import('../types/subscription').Subscription} Subscription
 */

class SequelizeSubscriptionRepo extends ISubscriptionRepo
{
    /**
     * @param {Subscription} data
     * @returns {Promise<Subscription>}
     */
    async createSub(data) 
    {
        return Subscription.create(data);
    }

    /**
     * @param {Partial<Subscription>} params
     * @returns {Promise<Subscription|null>}
     */
    async findSub(params) 
    {
        return Subscription.findOne({ where: params });
    }

    /**
     * @param {string} token
     * @returns {Promise<Subscription|null>}
     */
    async confirmSub(token) 
    {
        const sub = await Subscription.findOne({ where: { token } });
        if (!sub) return null;
        sub.confirmed = true;
        await sub.save();
        return sub;
    }

    /**
     * @param {string} token
     * @returns {Promise<Subscription|null>}
     */
    async deleteSub(token) 
    {
        const sub = await Subscription.findOne({ where: { token } });
        if (!sub) return null;
        await sub.destroy();
        return sub;
    }

    /**
     * @param {Partial<Subscription>} params
     * @returns {Promise<Subscription[]>}
     */
    async findAllSubs(params) 
    {
        return Subscription.findAll({ where: params });
    }

    async clear()
    {
        await Subscription.destroy({ where: {}, truncate: true, force: true });
    }
}

module.exports = SequelizeSubscriptionRepo;
