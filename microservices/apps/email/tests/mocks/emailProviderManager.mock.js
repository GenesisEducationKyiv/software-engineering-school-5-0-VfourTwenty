const Result = require('../../src/domain/types/result');

class EmailProviderManagerMock 
{
    async sendEmail(to, subject, html)
    {
        if (to === 'shouldfail@mail.com')
        {
            return new Result(false, 'email failed');
        }
        return new Result(true);
    }
}

module.exports = EmailProviderManagerMock;
