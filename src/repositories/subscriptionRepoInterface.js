class ISubscriptionRepo 
{
    async createSub(data) 
    {
        throw new Error('Not implemented');
    }

    async findSub(params) 
    {
        throw new Error('Not implemented');
    }

    async findAllSubs(params) 
    {
        throw new Error('Not implemented');
    }

    async confirmSub(token) 
    {
        throw new Error('Not implemented');
    }

    async deleteSub(token) 
    {
        throw new Error('Not implemented');
    }

    async clear() 
    {
        throw new Error('Not implemented');
    }
}

module.exports = ISubscriptionRepo;
