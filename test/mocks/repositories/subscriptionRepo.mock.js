const ISubscriptionRepo = require('../../../src/repositories/subscriptionRepoInterface');
const DTO = require('../../../src/domain/types/dto');
const SubscriptionDTO = require('../../../src/domain/types/subscription');

class SubscriptionRepoMock extends ISubscriptionRepo
{
    constructor() {
        super();
        this.subs = [];
    }

    async createSub(data) {
        this.subs.push({ ...data });
        return new DTO(true, '');
    }

    async findSub(params) {
        const sub = this.subs.find(sub =>
            Object.entries(params).every(([k, v]) => sub[k] === v)
        );
        if (sub) return new SubscriptionDTO(true, '', sub);
        return new DTO(false, 'Subscription not found');
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
            return new DTO(true, '');
        }
        return new DTO(false, 'Subscription not found');
    }

    async deleteSub(token) {
        const idx = this.subs.findIndex(sub => sub.token === token);
        if (idx !== -1) {
            this.subs.splice(idx, 1);
            return new DTO(true, '');
        }
        return new DTO(false, 'Subscription not found');
    }

    async clear() {
        this.subs = [];
        return new DTO(true, '');
    }
}

module.exports = SubscriptionRepoMock;
