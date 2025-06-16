require('dotenv').config();

module.exports = {
    development: {
        baseUrl: 'http://localhost:3001',
    },

    docker: {
        use_env_variable: 'DATABASE_URL',
        baseUrl: 'http://localhost:3000',
    },

    test: {
    },

    // deployed on render and railway
    production: {
        baseUrl: process.env.BASE_URL,
    }
};

