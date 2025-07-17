const { handleError } = require('../utils/errors');

class SubscriptionApiController
{
    constructor(
        subscribeUserUseCase,
        confirmSubscriptionUseCase,
        unsubscribeUserUseCase
    )
    {
        this.subscribeUserUseCase = subscribeUserUseCase;
        this.confirmSubscriptionUseCase = confirmSubscriptionUseCase;
        this.unsubscribeUserUseCase = unsubscribeUserUseCase;
    }

    subscribe = async (req, res) => 
    {
        const { email, city, frequency } = req.body;
        try 
        {
            await this.subscribeUserUseCase.subscribe(email, city, frequency);
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
            await this.confirmSubscriptionUseCase.confirm(token);
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
            await this.unsubscribeUserUseCase.unsubscribe(token);
            res.status(200).json({ message: 'Unsubscribed successfully' });
        }
        catch (err) 
        {
            handleError(err, res);
        }
    };
}

module.exports = SubscriptionApiController;
