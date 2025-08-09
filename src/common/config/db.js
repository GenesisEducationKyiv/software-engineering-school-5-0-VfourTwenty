require('dotenv').config({
    path: `.env.${process.env.NODE_ENV || 'development'}`
});

//db config
const use_env_variable = 'DATABASE_URL';
const username = process.env.DB_USER;
const password = process.env.DB_PASS;
const database = process.env.DB_NAME;
const host = process.env.DB_HOST;
const dialect = process.env.DB_DIALECT;

module.exports = {
    use_env_variable,
    username,
    password,
    database,
    host,
    dialect,
};
