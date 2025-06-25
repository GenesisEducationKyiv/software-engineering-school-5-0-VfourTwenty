const IProvider = require("../providerBase");

class IEmailProvider extends IProvider {
    async sendEmail(to, subject, body) {
        throw new Error("sendEmail() must be implemented by subclass");
    }
}


module.exports = IEmailProvider;

