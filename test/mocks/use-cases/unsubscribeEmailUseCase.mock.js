const Result = require("../../../src/domain/types/result");

class UnsubscribeEmailUseCaseMock
{
    async sendUnsubscribeEmail(to, token)
    {
        if (to === 'shouldfail@mail.com')
        {
            return new Result(false, 'UNSUBSCRIBE EMAIL FAILED');
        }
        return new Result(true);
    }
}

module.exports = UnsubscribeEmailUseCaseMock;
