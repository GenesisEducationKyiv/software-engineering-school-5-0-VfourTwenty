require('dotenv').config({
    path: `.env.${process.env.NODE_ENV || 'development'}`
});

const emailUrl = process.env.EMAIL_URL;
const frontendUrl = process.env.FRONTEND_URL;

const queueUrl = process.env.QUEUE_URL;
const queueName = process.env.QUEUE_NAME;

module.exports = {
    emailUrl,
    frontendUrl,
    queue:
        {
            queueUrl,
            queueName
        }
};
