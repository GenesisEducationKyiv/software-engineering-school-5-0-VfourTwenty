/**
 * @typedef {import('../types/dto').DTO} DTO
 * @typedef {import('../types/subscription').Subscription} Subscription
 */

class ISubscriptionRepo 
{
    /**
     * @param {Subscription} data
     * @returns {Promise<DTO>}
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
     * @returns {Promise<DTO>}
     */
    async confirmSub(token) 
    {
        throw new Error('Not implemented');
    }

    /**
     * @param {string} token
     * @returns {Promise<DTO>}
     */
    async deleteSub(token) 
    {
        throw new Error('Not implemented');
    }

    /**
     * @returns {Promise<DTO>}
     */
    async clear() 
    {
        throw new Error('Not implemented');
    }
}

module.exports = ISubscriptionRepo;
