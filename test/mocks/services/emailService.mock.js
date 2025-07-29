const Result = require("../../../src/domain/types/result");

class EmailServiceMock
{
    async sendEmail(to, subject, body)
    {
        if (to === 'shouldfail@mail.com')
        {
            return new Result(false, 'EMAIL FAILED');
        }
        return new Result(true);
    }
}

module.exports = EmailServiceMock;