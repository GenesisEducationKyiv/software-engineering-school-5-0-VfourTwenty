// redirection can be a separate frontend service
const { buildConfirmedUrl, buildUnsubscribedUrl, buildErrorUrl } = require('../utils/redirectUtils');
const { mapErrorToClientMessage } = require('../utils/errors');

class SubscriptionPublicController
{
    constructor(
        findSubscriptionUseCase,
        confirmSubscriptionUseCase,
        unsubscribeUserUseCase
    )
    {
        this.findSubscriptionUseCase = findSubscriptionUseCase;
        this.confirmSubscriptionUseCase = confirmSubscriptionUseCase;
        this.unsusbcribeUserUseCase = unsubscribeUserUseCase;
    }

    confirm = async (req, res) => 
    {
        const { token } = req.params;
        const result = await this.confirmSubscriptionUseCase.confirm(token);
        if (result.success)
        {
            const sub = await this.findSubscriptionUseCase.find(token);
            const url = buildConfirmedUrl(sub.city, sub.frequency, token);
            return res.redirect(url);
        }
        let errorMsg = mapErrorToClientMessage(result.err) || 'Internal server error 1';
        console.log('the error message is:', errorMsg);
        const errorUrl = buildErrorUrl(errorMsg);
        return res.redirect(errorUrl);
        // try
        // {
        //     await this.confirmSubscriptionUseCase.confirm(token);
        //     const sub = await this.findSubscriptionUseCase.find(token);
        //     const url = buildConfirmedUrl(sub.city, sub.frequency, token);
        //     return res.redirect(url);
        // }
        // catch (err)
        // {
        //     let errorMsg = mapErrorToClientMessage(err) || 'Internal server error 1';
        //     console.log('the error message is:', errorMsg);
        //     const errorUrl = buildErrorUrl(errorMsg);
        //     return res.redirect(errorUrl);
        // }
    };

    unsubscribe = async (req, res) => 
    {
        const { token } = req.params;
        const result = await this.unsusbcribeUserUseCase.unsubscribe(token);
        if (result.success)
        {
            const url = buildUnsubscribedUrl();
            return res.redirect(url);
        }
        let errorMsg = mapErrorToClientMessage(result.err) || 'Internal server error';
        const errorUrl = buildErrorUrl(errorMsg);
        return res.redirect(errorUrl);
        // try
        // {
        //     await this.unsusbcribeUserUseCase.unsubscribe(token);
        //     const url = buildUnsubscribedUrl();
        //     return res.redirect(url);
        // }
        // catch (err)
        // {
        //     let errorMsg = mapErrorToClientMessage(err) || 'Internal server error';
        //     const errorUrl = buildErrorUrl(errorMsg);
        //     return res.redirect(errorUrl);
        // }
    };
}

module.exports = SubscriptionPublicController;
