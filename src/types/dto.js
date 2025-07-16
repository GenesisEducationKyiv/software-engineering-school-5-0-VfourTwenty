/**
 * @typedef {Object} BaseDTO
 * @property {boolean} success
 * @property {string} err
 */

/**
 * @typedef {Object} DataDTO
 * @property {boolean} success
 * @property {string} err
 * @property {Subscription|Weather|null} data
 */

class DTO
{
    constructor(success, err)
    {
        this.success = success;
        this.err = err;
    }
}

module.exports = DTO;