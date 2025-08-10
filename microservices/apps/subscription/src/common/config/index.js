require('dotenv').config({
    path: `.env.${process.env.NODE_ENV || 'development'}`
});

// logger
const level = process.env.LOG_LEVEL;
const levelStrict = process.env.LOG_LEVEL_STRICT === 'true';
const filePath = level === 'null' ? '' : process.env.LOG_FILE_PATH;
const logToConsole = process.env.LOG_TO_CONSOLE === 'true';
const samplingRate = process.env.LOG_SAMPLING_RATE;

module.exports = {
    logger:
        {
            level,
            levelStrict,
            filePath,
            logToConsole,
            samplingRate
        }
};
