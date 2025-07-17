class SubscriptionError extends Error 
{
    constructor(message) 
    {
        super(message);
        this.name = 'SubscriptionError';
    }
}

module.exports = SubscriptionError; 
