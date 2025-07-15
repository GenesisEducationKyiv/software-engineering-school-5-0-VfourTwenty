/**
 * @typedef {import('../types/subscription').Subscription} Subscription
 */

class ISubscriptionRepo 
{
    /**
     * @param {Subscription} data
     * @returns {Promise<Subscription>}
     */
    async createSub(data) 
    {
        throw new Error('Not implemented');
    }

    /**
     * @param {Partial<Subscription>} params
     * @returns {Promise<Subscription|null>}
     */
    async findSub(params) 
    {
        throw new Error('Not implemented');
    }

    /**
     * @param {Partial<Subscription>} params
     * @returns {Promise<Subscription[]>}
     */
    async findAllSubs(params) 
    {
        throw new Error('Not implemented');
    }

    /**
     * @param {string} token
     * @returns {Promise<Subscription|null>}
     */
    async confirmSub(token) 
    {
        throw new Error('Not implemented');
    }

    /**
     * @param {string} token
     * @returns {Promise<boolean>}
     */
    async deleteSub(token) 
    {
        throw new Error('Not implemented');
    }

    /**
     * @returns {Promise<void>}
     */
    async clear() 
    {
        throw new Error('Not implemented');
    }
}

module.exports = ISubscriptionRepo;
