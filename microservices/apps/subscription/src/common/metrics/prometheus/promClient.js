const promClient = require('prom-client');

const register = new promClient.Registry();

module.exports = { promClient, register };
