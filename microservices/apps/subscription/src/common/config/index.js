require('dotenv').config({
    path: `.env.${process.env.NODE_ENV || 'development'}`
});

const queueUrl = process.env.QUEUE_URL;
const queueName = process.env.QUEUE_NAME;

module.exports = {
    queue :
        {
            queueUrl,
            queueName
        }
};
