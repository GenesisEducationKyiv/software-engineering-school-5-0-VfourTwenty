/**
 * @typedef {Object} Result
 * @property {boolean} success
 * @property {string | null} err
 * @property {any} data
 */

class Result
{
    constructor(success, err = null, data = null)
    {
        this.success = success;
        this.err = err;
        this.data = data;
    }
}

module.exports = Result;
