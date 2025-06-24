const { WeatherData } = require('../db/models');

/**
 * @typedef {Object} WeatherDataCreateOrUpdate
 * @property {string} city
 * @property {number} temperature
 * @property {number} humidity
 * @property {string} description
 * @property {Date} [fetchedAt]
 */

/**
 * @typedef {Object} WeatherDataSearchParams
 * @property {string} [city]
 * @property {number} [temperature]
 * @property {number} [humidity]
 * @property {string} [description]
 * @property {Date} [fetchedAt]
 */

class WeatherDataRepo {
    /**
     * Upsert (insert or update) weather data.
     * @param {WeatherDataCreateOrUpdate} data
     * @returns {Promise<[WeatherData, boolean]>}
     */
    static async upsert(data) {
        return WeatherData.upsert(data);
    }

    /**
     * Find weather data by primary key (city).
     * @param {string} city
     * @returns {Promise<WeatherData|null>}
     */
    static async findByPk(city) {
        return WeatherData.findByPk(city);
    }

    /**
     * Find all weather data matching params.
     * @param {WeatherDataSearchParams} params
     * @returns {Promise<WeatherData[]>}
     */
    static async findAllBy(params) {
        return WeatherData.findAll({ where: params });
    }

    /**
     * Delete weather data matching params.
     * @param {WeatherDataSearchParams} where
     * @returns {Promise<number>}
     */
    static async destroy(where) {
        return WeatherData.destroy({ where });
    }
}

module.exports = WeatherDataRepo;