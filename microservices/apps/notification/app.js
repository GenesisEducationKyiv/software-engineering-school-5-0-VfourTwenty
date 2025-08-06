const express = require('express');
const app = express();
app.use(express.json());

const { startConsumer } = require('./src/queue/consumer');

const PORT = process.env.PORT || 4009;
app.listen(PORT, () => {
    console.log(`Notification running on port ${PORT}`);
});

const { eventHandler } = require('./setup');
startConsumer('test_queue', (msg) => eventHandler.handleEvent(msg))