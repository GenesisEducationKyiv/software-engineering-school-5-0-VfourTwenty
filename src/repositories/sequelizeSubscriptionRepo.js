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
     * @returns {Promise<Subscription>}
     */
    async confirmSub(token) 
    {
        const sub = await Subscription.findOne({ where: { token } });
        if (!sub) throw new Error('TOKEN NOT FOUND');
        if (sub.confirmed) throw new Error('ALREADY CONFIRMED');
        sub.confirmed = true;
        await sub.save();
        return sub;
    }

    /**
     * @param {string} token
     * @returns {Promise<void>}
     */
    async deleteSub(token) 
    {
        const sub = await Subscription.findOne({ where: { token } });
        if (!sub) throw new Error('TOKEN NOT FOUND');
        await sub.destroy();
    }

    /**
     * @param {Partial<Subscription>} params
     * @returns {Promise<Subscription[]>}
     */
    async findAllSubs(params) 
    {
        return Subscription.findAll({ where: params });
    }
}

module.exports = SequelizeSubscriptionRepo;
