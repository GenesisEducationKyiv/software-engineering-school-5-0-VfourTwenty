/**
 * @typedef {import('../../../common/utils/result').Result} Result
 * @typedef {import('../../entities/subscription').Subscription} Subscription
 */

class ISubscriptionRepo 
{
    /**
     * @param {Subscription} data
     * @returns {Promise<Result>}
     */
    async createSub(data) 
    {
        throw new Error('Not implemented');
    }

    /**
     * @param {Partial<Subscription>} params
     * @returns {Promise<Result|null>}
     */
    async findSub(params) 
    {
        throw new Error('Not implemented');
    }

    /**
     * @param {Partial<Subscription>} params
     * @returns {Promise<Result>}
     */
    async findAllSubs(params) 
    {
        throw new Error('Not implemented');
    }

    /**
     * @param {string} token
     * @returns {Promise<Result>}
     */
    async confirmSub(token) 
    {
        throw new Error('Not implemented');
    }

    /**
     * @param {string} token
     * @returns {Promise<Result>}
     */
    async deleteSub(token) 
    {
        throw new Error('Not implemented');
    }

    /**
     * @returns {Promise<Result>}
     */
    async clear() 
    {
        throw new Error('Not implemented');
    }
}

module.exports = ISubscriptionRepo;
