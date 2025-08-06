const {handleError} = require("../../common/utils/clientErrors");

class SubscriptionController
{
    constructor(subscriptionService, subscriptionValidator)
    {
        this.subscriptionService = subscriptionService;
        this.subscriptionValidator = subscriptionValidator;
    }

    subscribe = async (req, res) =>
    {
        console.log('hitting subscribe in subscription');
        const { email, city, frequency } = req.body;

        // basic field validation
        const validationResult = this.subscriptionValidator.validateNewSubscription(email, city, frequency);
        if (!validationResult.success) return handleError(validationResult.err, res);

        const result = await this.subscriptionService.subscribeUser(email, city, frequency);
        console.log('res in sub controller in subscription (subscribe): ', result);
        if (result.success)
        {
            return res.status(200).json(result);
        }
        // subscription specific errors to statuses
        return handleError(result.err, res);
    };

    confirm = async (req, res) =>
    {
        console.log('hitting confirm in subscription');
        const { token } = req.body;

        const result = await this.subscriptionService.confirmSubscription(token);
        console.log('res in sub controller in subscription (confirm): ', result);
        if (result.success)
        {
            return res.status(200).json(result);
        }
        // subscription specific errors to statuses
        return handleError(result.err, res);
    };

    unsubscribe = async (req, res) =>
    {
        console.log('hitting confirm in subscription');
        const { token } = req.body;

        const result = await this.subscriptionService.unsubscribeUser(token);
        console.log('res in sub controller in subscription (unsubscribe): ', result);
        if (result.success)
        {
            return res.status(200).json(result);
        }
        // subscription specific errors to statuses
        return handleError(result.err, res);
    };

    findSub = async (req, res) =>
    {
        console.log('hitting findSub in subscription');
        const params = req.query;

        const result = await this.subscriptionService.findSub(params);
        console.log('res in sub controller in subscription (findSub): ', result);
        if (result.success)
        {
            return res.status(200).json(result);
        }
        // subscription specific errors to statuses
        return handleError(result.err, res);
    };

    findAllSubs = async (req, res) =>
    {
        console.log('hitting findAllSubs in subscription');
        const params = req.query;

        const result = await this.subscriptionService.findAllSubs(params);
        console.log('res in sub controller in subscription (findAllSubs): ', result);
        if (result.success)
        {
            return res.status(200).json(result);
        }
        // subscription specific errors to statuses
        return handleError(result.err, res);
    };
}

module.exports = SubscriptionController;