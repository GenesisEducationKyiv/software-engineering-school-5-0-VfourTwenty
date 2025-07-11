// redirection can be a separate frontend service
const { buildConfirmedUrl, buildUnsubscribedUrl, buildErrorUrl } = require('../utils/redirectUtils');

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
            const sub = await this.subscriptionService.confirmSubscription(token);
            const url = buildConfirmedUrl(sub.city, sub.frequency, token);
            return res.redirect(url);
        }
        catch (err) 
        {
            console.error('Confirmation frontend error:', err);
            let errorMsg = err.message || 'Internal server error 1';
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
            console.error('Unsubscribe frontend error:', err);
            let errorMsg = err.message || 'Internal server error';
            const errorUrl = buildErrorUrl(errorMsg);
            return res.redirect(errorUrl);
        }
    };
}

module.exports = SubscriptionPublicController;
