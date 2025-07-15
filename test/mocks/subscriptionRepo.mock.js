class MockSubscriptionRepo {
    constructor() {
        this.subs = [];
    }

    async createSub(data) {
        this.subs.push({ ...data });
        return data;
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
        if (sub) sub.confirmed = true;
        return sub;
    }

    async deleteSub(token) {
        const idx = this.subs.findIndex(sub => sub.token === token);
        if (idx !== -1) {
            this.subs.splice(idx, 1);
            return true;
        }
        return false;
    }
}

module.exports = MockSubscriptionRepo;
