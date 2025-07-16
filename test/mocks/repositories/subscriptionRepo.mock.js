const ISubscriptionRepo = require('../../../src/repositories/subscriptionRepoInterface');

class SubscriptionRepoMock extends ISubscriptionRepo
{
    constructor() {
        super();
        this.subs = [];
    }

    async createSub(data) {
        this.subs.push({ ...data });
        return { success: true, err: '' };
    }

    async findSub(params) {
        return this.subs.find(sub =>
            Object.entries(params).every(([k, v]) => sub[k] === v)
        ) || null;
    }

    async findAllSubs(params) {
        if (!params) return this.subs;
        return this.subs.filter(sub =>
            Object.entries(params).every(([k, v]) => sub[k] === v)
        );
    }

    async confirmSub(token) {
        const sub = this.subs.find(sub => sub.token === token);
        if (sub) {
            sub.confirmed = true;
            return { success: true, err: '' };
        }
        return { success: false, err: 'Subscription not found' };
    }

    async deleteSub(token) {
        const idx = this.subs.findIndex(sub => sub.token === token);
        if (idx !== -1) {
            this.subs.splice(idx, 1);
            return { success: true, err: '' };
        }
        return { success: false, err: 'Subscription not found' };
    }

    async clear() {
        this.subs = [];
        return { success: true, err: '' };
    }
}

module.exports = SubscriptionRepoMock;
