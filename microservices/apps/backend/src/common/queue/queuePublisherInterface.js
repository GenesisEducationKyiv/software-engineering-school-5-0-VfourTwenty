class IQueuePublisher 
{
    async publish(type, payload, queue) 
    {
        throw new Error('Not implemented');
    }
}

module.exports = IQueuePublisher;
