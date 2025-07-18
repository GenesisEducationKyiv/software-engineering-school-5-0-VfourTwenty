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
        const confirmResult = await this.confirmSubscriptionUseCase.confirm(token);
        if (confirmResult.success)
        {
            const findResult = await this.findSubscriptionUseCase.find(token);
            if (!findResult.success)
            {
                let errorMsg = mapErrorToClientMessage(findResult.err);
                const errorUrl = buildErrorUrl(errorMsg);
                return res.redirect(errorUrl);
            }
            const sub = findResult.subscription;
            const url = buildConfirmedUrl(sub.city, sub.frequency, token);
            return res.redirect(url);
        }
        let errorMsg = mapErrorToClientMessage(confirmResult.err) || 'Internal server error 1';
        const errorUrl = buildErrorUrl(errorMsg);
        return res.redirect(errorUrl);
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
