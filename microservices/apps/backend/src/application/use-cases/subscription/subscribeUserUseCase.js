class SubscribeUserUseCase
{
    // depends on a service interface
    constructor(cityValidator, subscriptionService)
    {
        this.cityValidator = cityValidator;
        this.subscriptionService = subscriptionService;
    }

    async subscribe(email, city, frequency)
    {
        const validationResult = await this.cityValidator.validate(city);
        if (!validationResult.success) return validationResult;
        console.log('just passed city validation (in use-case)');

        const subscriptionResult = await this.subscriptionService.subscribeUser(email, city, frequency);
        console.log('subscription service responded: ', subscriptionResult);

        return subscriptionResult;
    }
}

module.exports = SubscribeUserUseCase;
