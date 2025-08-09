const IQueuePublisher = require('../../../src/common/queue/IQueuePublisher');

class QueuePublisherMock extends IQueuePublisher
{
    async publish(type, payload, queue) {

    }
}

module.exports = QueuePublisherMock;