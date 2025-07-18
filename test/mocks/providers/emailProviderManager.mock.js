const DTO = require('../../../src/domain/types/dto');

class EmailProviderManagerMock {
    async sendEmail(to, subject, html)
    {
        if (to === 'shouldfail@mail.com')
        {
            return new DTO(false, 'email failed');
        }
        // not sure what this is...
        else if (to === 'shouldreturnnull@mail.com')
        {
            return null;
        }
        return new DTO(true, '');
    }
}

module.exports = EmailProviderManagerMock;
