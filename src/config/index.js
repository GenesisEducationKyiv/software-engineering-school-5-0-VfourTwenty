require('dotenv').config({
    path: `.env.${process.env.NODE_ENV || 'development'}`
});

module.exports = {
    baseUrl: process.env.BASE_URL || 'http://localhost:3001',
    use_env_variable: 'DATABASE_URL',
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    weatherApiKey: process.env.WEATHER_API_KEY,
    resendApiKey: process.env.RESEND_API_KEY,
    fromEmail: process.env.FROM_EMAIL
};