const ISubscriptionRepo = require('./ISubscriptionRepo')
const { Subscription } = require('../db/models')

/**
 * @typedef {import('../types/subscription').Subscription} Subscription
 */

class SequelizeSubscriptionRepo extends ISubscriptionRepo
{
    /**
     * @param {Subscription} data
     * @returns {Promise<Subscription>}
     */
    static async createSub(data) {
        return Subscription.create(data);
    }

    /**
     * @param {Partial<Subscription>} params
     * @returns {Promise<Subscription|null>}
     */
    static async findSub(params) {
        return Subscription.findOne({ where: params });
    }

    /**
     * @param {string} token
     * @returns {Promise<Subscription>}
     */
    static async confirmSub(token) {
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
    static async deleteSub(token) {
        const sub = await Subscription.findOne({ where: { token } });
        if (!sub) throw new Error('TOKEN NOT FOUND');
        await sub.destroy();
    }
}

module.exports = SequelizeSubscriptionRepo;
