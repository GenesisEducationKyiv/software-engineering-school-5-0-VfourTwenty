const fs = require('fs');

function logProviderResponse(logPath, providerName, data, isError = false) 
{
    const logEntry = `${new Date().toISOString()} [${providerName}] ${isError ? 'Error:' : 'Response:'} ${JSON.stringify(data)}\n`;
    fs.appendFileSync(logPath, logEntry);
}

function log(message, level = 'info') 
{
    const logEntry = `${new Date().toISOString()} [${level.toUpperCase()}] ${message}`;
    console.log(logEntry);
}

module.exports = {
    logProviderResponse,
    log
}; 
