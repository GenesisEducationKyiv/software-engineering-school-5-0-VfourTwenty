const ISubscriptionRepo = require('../../src/domain/interfaces/repositories/subscriptionRepoInterface');
const Result = require('../../src/common/utils/result');

class SubscriptionRepoMock extends ISubscriptionRepo
{
    constructor() 
    {
        super();
        this.subs = [];
    }

    async createSub(data) 
    {
        this.subs.push({ ...data });
        return new Result(true);
    }

    async findSub(params) 
    {
        const sub = this.subs.find(sub =>
            Object.entries(params).every(([k, v]) => sub[k] === v)
        );
        if (sub) return new Result(true, null, sub);
        return new Result(false, 'SUBSCRIPTION NOT FOUND');
    }

    async findAllSubs(params) 
    {
        if (!params) return this.subs;
        const subs = this.subs.filter(sub =>
            Object.entries(params).every(([k, v]) => sub[k] === v)
        );
        return new Result(true, null, subs);
    }

    async confirmSub(token) 
    {
        const sub = this.subs.find(sub => sub.token === token);
        if (sub) 
        {
            sub.confirmed = true;
            return new Result(true);
        }
        return new Result(false, 'SUBSCRIPTION NOT FOUND');
    }

    async deleteSub(token) 
    {
        const idx = this.subs.findIndex(sub => sub.token === token);
        if (idx !== -1) 
        {
            this.subs.splice(idx, 1);
            return new Result(true);
        }
        return new Result(false, 'SUBSCRIPTION NOT FOUND');
    }

    async clear() 
    {
        this.subs = [];
        return new Result(true);
    }
}

module.exports = SubscriptionRepoMock;
