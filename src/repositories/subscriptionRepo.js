const { Subscription } = require('../db/models')

/**
 * @typedef {Object} SubscriptionCreateData
 * @property {string} email
 * @property {string} city
 * @property {string} frequency
 * @property {boolean} confirmed
 * @property {string} token
 */

/**
 * @typedef {Object} SubscriptionSearchParams
 * @property {string} [email]
 * @property {string} [city]
 * @property {string} [frequency]
 * @property {boolean} [confirmed]
 * @property {string} [token]
 */

/**
 * @typedef {Object} SubscriptionUpdateValues
 * @property {string} [email]
 * @property {string} [city]
 * @property {string} [frequency]
 * @property {boolean} [confirmed]
 * @property {string} [token]
 */

class SubscriptionRepo
{
    /**
     * Create a new subscription
     * @param {SubscriptionCreateData} data
     * @returns {Promise<import('../db/models/subscription').Subscription>}
     */
    static async create(data) {
        return Subscription.create(data);
    }

    /**
     * Find a subscription by one or more fields.
     * @param {SubscriptionSearchParams} params
     * @returns {Promise<import('../db/models/subscription').Subscription|null>}
     */
    static async findOneBy(params) {
        return Subscription.findOne({ where: params });
    }

    /**
     * Find all subscriptions matching the given parameters.
     * @param {SubscriptionSearchParams} params
     * @returns {Promise<Array<import('../db/models/subscription').Subscription>>}
     */
    static async findAllBy(params) {
        return Subscription.findAll({ where: params });
    }

    /**
     * Update subscriptions matching the given parameters.
     * @param {SubscriptionUpdateValues} values
     * @param {SubscriptionSearchParams} where
     * @returns {Promise<[number, import('../db/models/subscription').Subscription[]]>}
     */
    static async update(values, where) {
        return Subscription.update(values, { where });
    }

    /**
     * Delete subscriptions matching the given parameters.
     * @param {SubscriptionSearchParams} where
     * @returns {Promise<number>} Number of rows deleted
     */
    static async destroy(where) {
        return Subscription.destroy({ where });
    }

    /**
     * Save changes to a subscription instance.
     * @param {import('../db/models/subscription').Subscription} instance
     * @returns {Promise<import('../db/models/subscription').Subscription>}
     */
    static async saveInstance(instance) {
        return instance.save();
    }

    /**
     * Destroy (delete) a subscription instance.
     * @param {import('../db/models/subscription').Subscription} instance
     * @returns {Promise<void>}
     */
    static async destroyInstance(instance) {
        return instance.destroy();
    }
}

module.exports = SubscriptionRepo;
