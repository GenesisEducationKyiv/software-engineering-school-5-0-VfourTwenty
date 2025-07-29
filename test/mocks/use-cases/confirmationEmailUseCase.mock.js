const Result = require("../../../src/domain/types/result");

class ConfirmationEmailUseCaseMock
{
    async sendConfirmationEmail(to, token)
    {
        if (to === 'shouldfail@mail.com')
        {
            return new Result(false, 'CONFIRMATION EMAIL FAILED');
        }
        return new Result(true);
    }
}

module.exports = ConfirmationEmailUseCaseMock;
