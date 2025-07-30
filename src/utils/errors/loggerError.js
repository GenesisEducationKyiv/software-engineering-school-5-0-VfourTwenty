class LoggerError extends Error
{
    // type: 'config' | 'filesystem'
    constructor(type, message)
    {
        super(`[${type.toUpperCase()} ERROR] ${message}`);
        this.type = type;
        this.message = message;
    }
}

module.exports = LoggerError;