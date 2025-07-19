const DTO = require("../../../src/domain/types/dto");

class EmailServiceMock
{
    async sendEmail(to, subject, body)
    {
        if (to === 'shouldfail@mail.com')
        {
            return new DTO(false, 'EMAIL FAILED');
        }
        return new DTO(true, '');
    }
}

module.exports = EmailServiceMock;