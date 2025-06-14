require('dotenv').config();

module.exports = {
    development: {
        username: 'postgres',
        password: 'alwayssunny',
        database: 'weather_db',
        host: '127.0.0.1',
        dialect: 'postgres'
    },

    docker: {
        use_env_variable: 'DATABASE_URL',
        dialect: 'postgres'
    },

    test: {
        username: 'postgres',
        password: 'alwayssunny',
        database: 'weather_db_test',
        host: '127.0.0.1',
        dialect: 'postgres'
    },

    // deployed on render
    production: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    }
};

