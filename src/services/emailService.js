/**
 * @typedef {Object} EmailProvider
 * @property {function(string, string, string): Promise<any>} sendEmail
 */

const providerState = require('../providers/state.js');

class EmailService {
    /**
     * The active email provider (can be swapped for testing or runtime changes)
     * @type {EmailProvider}
     */
    static provider = providerState.activeEmailProvider;

    /**
     * Set the active email provider
     * @param {EmailProvider} provider
     */
    static setProvider(provider) {
        EmailService.provider = provider;
    }

    /**
     * Send an email using the current provider
     * @param {string} to
     * @param {string} subject
     * @param {string} body
     * @returns {Promise<any>}
     */
    static async sendEmail(to, subject, body) {
        return EmailService.provider.sendEmail(to, subject, body);
    }
}

module.exports = EmailService;