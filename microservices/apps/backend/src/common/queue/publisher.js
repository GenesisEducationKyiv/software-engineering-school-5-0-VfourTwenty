const amqp = require('amqplib');

let channel;
const defaultQueue = 'test_queue';

async function setupRabbitMQ() {
    if (!channel) {
        const conn = await amqp.connect('amqp://rabbitmq:5672');
        channel = await conn.createChannel();
        await channel.assertQueue('test_queue', { durable: true });
    }
}

async function publish(type, payload, queue = defaultQueue) {
    await setupRabbitMQ(queue);
    const message = JSON.stringify({ type, payload });
    channel.sendToQueue(queue, Buffer.from(message));
    console.log(` [x] Sent event of type '${type}' to queue '${queue}':`, payload);
}

module.exports = { publish };