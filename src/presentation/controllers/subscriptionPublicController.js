// redirection can be a separate frontend service
const { buildConfirmedUrl, buildUnsubscribedUrl, buildErrorUrl } = require('../../common/utils/redirectUtils');
const { mapErrorToClientMessage } = require('../../common/utils/errors/clientErrors');

class SubscriptionPublicController
{
    constructor(
        subscriptionValidator,     // will be deprecated once frontend starts calling the api
        confirmSubscriptionUseCase,
        unsubscribeUserUseCase
    )
    {
        this.subscriptionValidator = subscriptionValidator;
        this.confirmSubscriptionUseCase = confirmSubscriptionUseCase;
        this.unsusbcribeUserUseCase = unsubscribeUserUseCase;
    }

    confirm = async (req, res) => 
    {
        const { token } = req.params;

        const validationResult = this.subscriptionValidator.validateToken(token);
        if (!validationResult.success)
        {
            const errorUrl = buildErrorUrl(mapErrorToClientMessage(validationResult.err));
            return res.redirect(errorUrl);
        }

        const confirmResult = await this.confirmSubscriptionUseCase.confirm(token);
        if (confirmResult.success) 
        {
            const sub = confirmResult.data;
            const url = buildConfirmedUrl(sub.city, sub.frequency, token);
            return res.redirect(url);
        }

        let errorMsg = mapErrorToClientMessage(confirmResult.err) || 'Internal server error';
        const errorUrl = buildErrorUrl(errorMsg);
        return res.redirect(errorUrl);
    };

    unsubscribe = async (req, res) => 
    {
        const { token } = req.params;

        const validationResult = this.subscriptionValidator.validateToken(token);
        if (!validationResult.success)
        {
            const errorUrl = buildErrorUrl(mapErrorToClientMessage(validationResult.err));
            return res.redirect(errorUrl);
        }

        const result = await this.unsusbcribeUserUseCase.unsubscribe(token);
        if (result.success)
        {
            const url = buildUnsubscribedUrl();
            return res.redirect(url);
        }
        let errorMsg = mapErrorToClientMessage(result.err) || 'Internal server error';
        const errorUrl = buildErrorUrl(errorMsg);
        return res.redirect(errorUrl);
    };
}

module.exports = SubscriptionPublicController;
