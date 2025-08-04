const ResendEmailProvider = require('./src/infrastructure/providers/resendEmailProvider');
const EmailProviderManager = require('./src/infrastructure/providers/emailProviderManager');
const EmailService = require('./src/application/emailService');
const EmailController = require('./src/presentation/controllers/emailController');

const resendEmailProvider = new ResendEmailProvider();
const emailProviderManager = new EmailProviderManager([resendEmailProvider]);
const emailService = new EmailService(emailProviderManager);
const emailController = new EmailController(emailService);

module.exports = {
    emailController
}