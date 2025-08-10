require('dotenv').config({
    path: `.env.${process.env.NODE_ENV || 'development'}`
});

const emailUrl = process.env.EMAIL_URL;
const frontendUrl = process.env.FRONTEND_URL;

const queueUrl = process.env.QUEUE_URL;
const queueName = process.env.QUEUE_NAME;

// logger
const level = process.env.LOG_LEVEL;
const levelStrict = process.env.LOG_LEVEL_STRICT === 'true';
const filePath = level === 'null' ? '' : process.env.LOG_FILE_PATH;
const logToConsole = process.env.LOG_TO_CONSOLE === 'true';
const samplingRate = process.env.LOG_SAMPLING_RATE;

module.exports = {
    emailUrl,
    frontendUrl,
    queue:
        {
            queueUrl,
            queueName
        },
    logger:
        {
            level,
            levelStrict,
            filePath,
            logToConsole,
            samplingRate
        }
};
