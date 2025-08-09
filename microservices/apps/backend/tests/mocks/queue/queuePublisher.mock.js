const IQueuePublisher = require('../../../src/common/queue/queuePublisherInterface');

class QueuePublisherMock extends IQueuePublisher
{
    async publish(type, payload, queue) 
    {

    }
}

module.exports = QueuePublisherMock;
