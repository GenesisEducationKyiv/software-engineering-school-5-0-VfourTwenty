const amqp = require('amqplib');

async function startConsumer(queue, onMessage) {
    const conn = await amqp.connect('amqp://rabbitmq:5672');
    const channel = await conn.createChannel();
    await channel.assertQueue(queue, { durable: true });

    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
    channel.consume(queue, (msg) => {
        if (msg !== null) {
            // Call your handler with the message content
            onMessage(msg.content.toString());
            channel.ack(msg);
        }
    });
}

module.exports = { startConsumer };