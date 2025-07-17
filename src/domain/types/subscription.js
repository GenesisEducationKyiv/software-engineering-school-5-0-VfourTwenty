const DTO = require('./dto');

/**
 * @typedef {Object} Subscription
 * @property {string} email
 * @property {string} city
 * @property {'hourly'|'daily'} frequency
 * @property {boolean} confirmed
 * @property {string} token
 */

class SubscriptionDTO extends DTO
{
    /**
     * @param {boolean} success
     * @param {string} err
     * @param {Weather|null} data
     */
    constructor(success, err, data)
    {
        super(success, err);
        this.data = data;
    }
}

module.exports = SubscriptionDTO;
