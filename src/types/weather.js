const DTO = require('./dto');

/**
 * @typedef {Object} Weather
 * @property {string} city
 * @property {number} temperature
 * @property {number} humidity
 * @property {string} description
 */

class WeatherDTO extends DTO
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

module.exports = WeatherDTO;