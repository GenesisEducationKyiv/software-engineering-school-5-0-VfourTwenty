const express = require('express');
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 4009;
app.listen(PORT, () => {
    console.log(`Notification running on port ${PORT}`);
});

const { eventHandler, queueConsumer } = require('./setup');
const config = require('./src/common/config/index').queue;
queueConsumer.start(config.queueName, (msg) => eventHandler.handleEvent(msg));
