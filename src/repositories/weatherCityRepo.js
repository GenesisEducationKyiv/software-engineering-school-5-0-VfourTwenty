const { WeatherCity } = require('../db/models');

/**
 * @typedef {Object} WeatherCitySearchParams
 * @property {string} [city]
 * @property {number} [hourly_count]
 * @property {number} [daily_count]
 */

/**
 * @typedef {Object} WeatherCityCreateData
 * @property {string} city
 * @property {number} [hourly_count]
 * @property {number} [daily_count]
 */

class WeatherCityRepo {
    /**
     * Create a new city entry.
     * @param {WeatherCityCreateData} data
     * @returns {Promise<WeatherCity>}
     */
    static async create(data) {
        return WeatherCity.create(data);
    }

    /**
     * Find one city by params.
     * @param {WeatherCitySearchParams} params
     * @returns {Promise<WeatherCity|null>}
     */
    static async findOneBy(params) {
        return WeatherCity.findOne({ where: params });
    }

    /**
     * Find all cities by params.
     * @param {WeatherCitySearchParams} params
     * @returns {Promise<WeatherCity[]>}
     */
    static async findAllBy(params) {
        return WeatherCity.findAll({ where: params });
    }

    /**
     * Update cities matching params.
     * @param {Partial<WeatherCityCreateData>} values
     * @param {WeatherCitySearchParams} where
     * @returns {Promise<[number, WeatherCity[]]>}
     */
    static async update(values, where) {
        return WeatherCity.update(values, { where });
    }

    /**
     * Save changes to a city instance.
     * @param {WeatherCity} instance
     * @returns {Promise<WeatherCity>}
     */
    static async saveInstance(instance) {
        return instance.save();
    }

    /**
     * Delete a city
     * @returns {Promise<number>}
     * @param {import('../db/models/subscription').WeatherCity} instance
     */
    static async destroyInstance(instance) {
        return instance.destroy();
    }

    // clear all matching entries
    static async destroy(where) {
        return WeatherCity.destroy({ where });
    }
}

module.exports = WeatherCityRepo;