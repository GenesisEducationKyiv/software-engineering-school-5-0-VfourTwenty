const { handleError } = require('../../common/utils/errors/clientErrors');

class SubscriptionApiController
{
    constructor(
        subscriptionValidator,
        subscribeUserUseCase,
        confirmSubscriptionUseCase,
        unsubscribeUserUseCase
    )
    {
        this.subscriptionValidator = subscriptionValidator;
        this.subscribeUserUseCase = subscribeUserUseCase;
        this.confirmSubscriptionUseCase = confirmSubscriptionUseCase;
        this.unsubscribeUserUseCase = unsubscribeUserUseCase;
    }

    subscribe = async (req, res) => 
    {
        const { email, city, frequency } = req.body;

        // basic field validation
        const validationResult = this.subscriptionValidator.validateNewSubscription(email, city, frequency);
        if (!validationResult.success) return handleError(validationResult.err, res);

        const result = await this.subscribeUserUseCase.subscribe(email, city, frequency);
        if (result.success)
        {
            return res.status(200).json({ message: 'Subscription successful. Confirmation email sent.' });
        }
        return handleError(result.err, res);
    };

    confirm = async (req, res) => 
    {
        const { token } = req.params;

        const validationResult = this.subscriptionValidator.validateToken(token);
        if (!validationResult.success) return handleError(validationResult.err, res);

        const result = await this.confirmSubscriptionUseCase.confirm(token);
        if (result.success)
        {
            return res.status(200).json({ message: 'Subscription confirmed successfully' });
        }
        return handleError(result.err, res);
    };

    unsubscribe = async (req, res) => 
    {
        const { token } = req.params;

        const validationResult = this.subscriptionValidator.validateToken(token);
        if (!validationResult.success) return handleError(validationResult.err, res);

        const result = await this.unsubscribeUserUseCase.unsubscribe(token);
        if (result.success)
        {
            return res.status(200).json({ message: 'Unsubscribed successfully' });
        }
        return handleError(result.err, res);
    };
}

module.exports = SubscriptionApiController;
