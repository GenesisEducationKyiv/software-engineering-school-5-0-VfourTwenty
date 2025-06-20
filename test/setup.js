const Module = require('module');
const originalLoad = Module._load;


Module._load = function (request, parent, isMain) {
    if (request === '../services/weatherService')
    {
        console.log(`Intercepted require for weatherService, returning mock`);
        return require('./mocks/weatherService.mock');
    }
    else if (request === '../services/emailService')
    {
        console.log(`Intercepted require for emailService, returning mock`);
        return require('./mocks/emailService.mock');
    }
    return originalLoad.apply(this, arguments);
};