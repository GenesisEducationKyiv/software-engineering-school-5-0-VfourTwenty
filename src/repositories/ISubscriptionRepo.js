class ISubscriptionRepo {
    static async createSub(data) {
        throw new Error('Not implemented');
    }

    static async findSub(params) {
        throw new Error('Not implemented');
    }

    static async confirmSub(token) {
        throw new Error('Not implemented');
    }

    static async deleteSub(token) {
        throw new Error('Not implemented');
    }
}

module.exports = ISubscriptionRepo;