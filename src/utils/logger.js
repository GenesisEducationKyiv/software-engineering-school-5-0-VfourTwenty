const fs = require('fs');
const path = require('path');

const LoggerError = require('./errors/loggerError');

class Logger
{
    static LEVELS = {
        null: 0,
        error: 1,
        warn: 2,
        info: 3,
        debug: 4
    };

    constructor(options = {}, entity = null)
    {
        /* eslint-disable @stylistic/brace-style */ // for constructor readability
        if (!options) {
            throw new LoggerError('config', 'No options for config provided');
        }

        if (typeof options.level !== 'string' || !(options.level in Logger.LEVELS)) {
            console.warn(`Invalid level value: ${options.level}. Defaulting to info.`);
            this.level = 'info';
        } else {
            this.level = options.level;
        }

        if (this.level === 'null') return; // no further setup is needed, logging is disabled

        if (!options.logFilePath)
        {
            throw new LoggerError('config', 'Invalid filepath provided.');
        }
        const resolvedLogFilePath = path.isAbsolute(options.logFilePath)
            ? options.logFilePath
            : path.resolve(process.cwd(), options.logFilePath);

        const logDir = path.dirname(resolvedLogFilePath);
        try
        {
            fs.mkdirSync(logDir, { recursive: true }); // create directories
            fs.openSync(resolvedLogFilePath, 'a');       // create the file if it doesn't exist
        }
        catch (err)
        {
            throw new LoggerError('filesystem', `Failed to create log file: ${err.message}`);
        }
        this.logFilePath = resolvedLogFilePath;

        if (typeof options.samplingRate !== 'number' || options.samplingRate < 0 || options.samplingRate > 1) {
            console.warn(`Invalid sampling rate: ${options.samplingRate}. Defaulting to 1.`);
            this.samplingRate = 1;
        } else {
            this.samplingRate = options.samplingRate;
        }
        /* eslint-enable @stylistic/brace-style */

        this.levelStrict = options.levelStrict;
        this.writeToConsole = options.writeToConsole;

        this.entity = entity;
    }

    _buildLogString(level, message, meta)
    {
        const entityTag = this.entity ? ` [${this.entity}]` : '';
        return `${new Date().toISOString()} [${level.toUpperCase()}]${entityTag} ${message}${meta ? ' ' + JSON.stringify(meta).slice(0, 1000) : ''}`;
    }

    _shouldBeLogged(level)
    {
        return (
            (
                (this.levelStrict && Logger.LEVELS[this.level] === level) ||
                (!this.levelStrict && Logger.LEVELS[this.level] >= level)
            ) && Math.random() < this.samplingRate
        );
    }

    _log(logString)
    {
        fs.appendFileSync(this.logFilePath, logString + '\n');
    }

    // external functions
    for(entity)
    {
        // Return a new logger instance with the entity name set
        return new Logger({
            level: this.level,
            levelStrict: this.levelStrict,
            logFilePath: this.logFilePath,
            writeToConsole: this.writeToConsole,
            samplingRate: this.samplingRate
        }, entity);
    }

    debug(message, meta)
    {
        if (this._shouldBeLogged(Logger.LEVELS.debug))
        {
            const logString = this._buildLogString('debug', message, meta);
            this._log(logString);
            if (this.writeToConsole)
            {
                console.log(logString);
            }
        }
    }

    info(message, meta)
    {
        if (this._shouldBeLogged(Logger.LEVELS.info))
        {
            const logString = this._buildLogString('info', message, meta);
            this._log(logString);
            if (this.writeToConsole)
            {
                console.log(logString);
            }
        }
    }

    warn(message, meta)
    {
        if (this._shouldBeLogged(Logger.LEVELS.warn))
        {
            const logString = this._buildLogString('warn', message, meta);
            this._log(logString);
            if (this.writeToConsole)
            {
                console.warn(logString);
            }
        }
    }

    error(message, meta)
    {
        if (this._shouldBeLogged(Logger.LEVELS.error))
        {
            const logString = this._buildLogString('error', message, meta);
            this._log(logString);
            if (this.writeToConsole)
            {
                console.error(logString);
            }
        }
    }
}

module.exports = Logger;
