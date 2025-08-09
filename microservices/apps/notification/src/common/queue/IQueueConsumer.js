class IQueueConsumer {
    async start(queue, onMessage) {
        throw new Error('Not implemented');
    }
}
module.exports = IQueueConsumer;