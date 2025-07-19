const DTO = require('../../../src/domain/types/dto');

class EmailProviderManagerMock {
    async sendEmail(to, subject, html)
    {
        if (to === 'shouldfail@mail.com')
        {
            return new DTO(false, 'email failed');
        }
        return new DTO(true, '');
    }
}

module.exports = EmailProviderManagerMock;
