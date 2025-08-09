const Logger = require('./src/common/utils/logger');
const ResendEmailProvider = require('./src/infrastructure/providers/resendEmailProvider');
const EmailProviderManager = require('./src/infrastructure/providers/emailProviderManager');
const EmailService = require('./src/application/emailService');
const EmailController = require('./src/presentation/controllers/emailController');

const config = require('./src/common/config/index').logger;
const logger = new Logger(config);
const metricsProvider = require('./src/common/metrics/metricsSetup');
const resendEmailProvider = new ResendEmailProvider();
const emailProviderManager = new EmailProviderManager([resendEmailProvider], logger, metricsProvider);
const emailService = new EmailService(emailProviderManager, metricsProvider);
const emailController = new EmailController(emailService);

module.exports = {
    emailController
};
