const amqp = require('amqplib');
const IQueuePublisher = require('../queuePublisherInterface');

class RabbitMQPublisher extends IQueuePublisher 
{
    constructor(url, defaultQueue) 
    {
        super();
        this.url = url;
        this.defaultQueue = defaultQueue;
        this.channel = null;
    }

    async setup(queue) 
    {
        if (!this.channel) 
        {
            const conn = await amqp.connect(this.url);
            this.channel = await conn.createChannel();
        }
        await this.channel.assertQueue(queue, { durable: true });
    }

    async publish(type, payload, queue = this.defaultQueue) 
    {
        await this.setup(queue);
        const message = JSON.stringify({ type, payload });
        this.channel.sendToQueue(queue, Buffer.from(message));
        console.log(` [x] Sent event of type '${type}' to queue '${queue}':`, payload);
    }
}

module.exports = RabbitMQPublisher;
