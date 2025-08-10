const amqp = require('amqplib');
const IQueueConsumer = require('../queueConsumerInterface');

class RabbitMQConsumer extends IQueueConsumer 
{
    constructor(url) 
    {
        super();
        this.url = url;
    }

    async start(queue, onMessage) 
    {
        const conn = await amqp.connect(this.url);
        const channel = await conn.createChannel();
        await channel.assertQueue(queue, { durable: true });

        console.log(' [*] Waiting for messages in %s. To exit press CTRL+C', queue);
        channel.consume(queue, (msg) => 
        {
            if (msg !== null) 
            {
                onMessage(msg.content.toString());
                channel.ack(msg);
            }
        });
    }
}

module.exports = RabbitMQConsumer;
