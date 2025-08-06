const amqp = require('amqplib');

let channel;

async function setupRabbitMQ() {
    if (!channel) {
        const conn = await amqp.connect('amqp://rabbitmq:5672');
        channel = await conn.createChannel();
        await channel.assertQueue('test_queue', { durable: true });
    }
}

async function publish(msg) {
    await setupRabbitMQ();
    channel.sendToQueue('test_queue', Buffer.from(msg));
    console.log(" [x] Sent '%s'", msg);
}

module.exports = { publish };