// redirection can be a separate frontend service
const { buildConfirmedUrl, buildUnsubscribedUrl, buildErrorUrl } = require('../utils/redirectUtils');
const { mapErrorToClientMessage } = require('../utils/errors');

class SubscriptionPublicController
{
    constructor(subscriptionService)
    {
        this.subscriptionService = subscriptionService;
    }

    confirm = async (req, res) => 
    {
        const { token } = req.params;
        try 
        {
            await this.subscriptionService.confirmSubscription(token);
            const sub = await this.subscriptionService.findSub({ token: token });
            const url = buildConfirmedUrl(sub.city, sub.frequency, token);
            return res.redirect(url);
        }
        catch (err) 
        {
            let errorMsg = mapErrorToClientMessage(err) || 'Internal server error 1';
            console.log('the error message is:', errorMsg);
            const errorUrl = buildErrorUrl(errorMsg);
            return res.redirect(errorUrl);
        }
    };

    unsubscribe = async (req, res) => 
    {
        const { token } = req.params;
        try 
        {
            await this.subscriptionService.unsubscribeUser(token);
            const url = buildUnsubscribedUrl();
            return res.redirect(url);
        }
        catch (err) 
        {
            let errorMsg = mapErrorToClientMessage(err) || 'Internal server error';
            const errorUrl = buildErrorUrl(errorMsg);
            return res.redirect(errorUrl);
        }
    };
}

module.exports = SubscriptionPublicController;
