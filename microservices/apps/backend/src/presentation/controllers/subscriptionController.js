const { handleError } = require('../../common/utils/clientErrors');

class SubscriptionController
{
    constructor(
        subscriptionDtoValidator,
        subscriptionUseCase
    )
    {
        this.subscriptionDtoValidator = subscriptionDtoValidator;
        this.subscriptionUseCase = subscriptionUseCase;
    }

    subscribe = async (req, res) => 
    {
        console.log('req method: ', req.method);
        console.log('req headers: ', req.headers);
        console.log('hitting subscribe on backend');
        console.log('REQ BODY IN BACKEND: ', req.body);
        const { email, city, frequency } = req.body;

        // basic field validation
        const validationResult = this.subscriptionDtoValidator.validateNewSubscription(email, city, frequency);
        if (!validationResult.success) return handleError(validationResult.err, res);

        const result = await this.subscriptionUseCase.subscribe(email, city, frequency);
        if (result.success)
        {
            return res.status(200).json({ message: 'Subscription successful. Confirmation email sent.' });
        }
        return handleError(result.err, res);
    };

    confirm = async (req, res) => 
    {
        console.log('hitting confirm on backend');
        const { token } = req.params;

        const validationResult = this.subscriptionDtoValidator.validateToken(token);
        console.log('token validation result: ', validationResult);
        if (!validationResult.success) return handleError(validationResult.err, res);

        const result = await this.subscriptionUseCase.confirm(token);
        console.log('result from confirm use case: ', result);
        if (result.success)
        {
            return res.status(200).json(result);
        }
        return handleError(result.err, res);
    };

    unsubscribe = async (req, res) => 
    {
        const { token } = req.params;

        const validationResult = this.subscriptionDtoValidator.validateToken(token);
        if (!validationResult.success) return handleError(validationResult.err, res);

        const result = await this.subscriptionUseCase.unsubscribe(token);
        if (result.success)
        {
            return res.status(200).json({ message: 'Unsubscribed successfully' });
        }
        return handleError(result.err, res);
    };
}

module.exports = SubscriptionController;
