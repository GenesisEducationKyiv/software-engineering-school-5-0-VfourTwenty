const { handleError } = require('../utils/errors');

class SubscriptionApiController
{
    constructor(subscriptionService)
    {
        this.subscriptionService = subscriptionService;
    }

    subscribe = async (req, res) => 
    {
        const { email, city, frequency } = req.body;
        try 
        {
            // await validateCity(city, this.weatherService);
            await this.subscriptionService.subscribeUser(email, city, frequency);
            res.status(200).json({ message: 'Subscription successful. Confirmation email sent.' });
        }
        catch (err) 
        {
            handleError(err, res);
        }
    };

    confirm = async (req, res) => 
    {
        const { token } = req.params;
        try 
        {
            await this.subscriptionService.confirmSubscription(token);
            res.status(200).json({ message: 'Subscription confirmed successfully' });
        }
        catch (err) 
        {
            handleError(err, res);
        }
    };

    unsubscribe = async (req, res) => 
    {
        const { token } = req.params;
        try 
        {
            await this.subscriptionService.unsubscribeUser(token);
            res.status(200).json({ message: 'Unsubscribed successfully' });
        }
        catch (err) 
        {
            handleError(err, res);
        }
    };
}

module.exports = SubscriptionApiController;
