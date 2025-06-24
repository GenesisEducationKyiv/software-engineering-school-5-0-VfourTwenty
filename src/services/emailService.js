// mock this array for tests
const emailProviders = require('../providers/email-providers/emailProvidersAll');

/**
 * @typedef {Object} EmailProvider
 * @property {function(string, string, string): Promise<any>} sendEmail
 * @property {string} name
 */

class EmailService {
    /**
     * Try each provider in order until one succeeds.
     * @param {string} to
     * @param {string} subject
     * @param {string} body
     * @returns {Promise<any>}
     */

    static logPath = require('path').join(__dirname, '../../logs/emailProvider.log');
    static loggingEnabled = true;

    // turn of logs for tests
    static setLoggingEnabled(enabled) {
        EmailService.loggingEnabled = enabled;
    }

    static async sendEmail(to, subject, body) {
        for (const provider of emailProviders) {
            try {
                const result = await provider.sendEmail(to, subject, body);
                EmailService.logProviderResponse(provider.name, result);
                if (result) return result;
            } catch (err) {
                EmailService.logProviderResponse(provider.name, err, true);
            }
        }
        throw new Error('All email providers failed');
    }

    /**
     * Log the provider response or error to a file
     * @param {string} providerName
     * @param {any} data
     * @param {boolean} [isError=false]
     */
    static logProviderResponse(providerName, data, isError = false) {
        const logEntry = `${new Date().toISOString()} [${providerName}] ${isError ? 'Error:' : 'Response:'} ${JSON.stringify(data)}\n`;
        require('fs').appendFileSync(EmailService.logPath, logEntry);
    }
}

module.exports = EmailService;