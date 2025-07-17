/**
 * @typedef {Object} DTO
 * @property {boolean} success
 * @property {string} err
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
