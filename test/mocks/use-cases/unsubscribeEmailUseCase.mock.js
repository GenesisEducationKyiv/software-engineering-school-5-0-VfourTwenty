const DTO = require("../../../src/domain/types/dto");

class UnsubscribeEmailUseCaseMock
{
    async sendUnsubscribeEmail(to, token)
    {
        if (to === 'shouldfail@mail.com')
        {
            return new DTO(false, 'UNSUBSCRIBE EMAIL FAILED');
        }
        return new DTO(true, '');
    }
}

module.exports = UnsubscribeEmailUseCaseMock;
