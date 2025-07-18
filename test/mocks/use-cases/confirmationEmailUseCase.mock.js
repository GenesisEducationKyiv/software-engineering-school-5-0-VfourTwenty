const DTO = require("../../../src/domain/types/dto");

class ConfirmationEmailUseCaseMock
{
    async sendConfirmationEmail(to, token)
    {
        if (to === 'shouldfail@mail.com')
        {
            return new DTO(false, 'CONFIRMATION EMAIL FAILED');
        }
        return new DTO(true, '');
    }
}

module.exports = ConfirmationEmailUseCaseMock;
