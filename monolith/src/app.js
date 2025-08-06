const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const createError = require('http-errors');

const weatherRouter = require('./presentation/routes/weather');
const subscriptionRouter = require('./presentation/routes/subscription');
const publicRouter = require('./presentation/routes/public');

const { register } = require('./common/metrics/prometheus/promClient');

const { cronMain } = require('./setup');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'presentation/public')));

// Mount routes
app.use('/api', weatherRouter);
app.use('/api', subscriptionRouter);

// public route
app.use('/', publicRouter);

app.get('/metrics', async (req, res) =>
{
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});

// 404 handler
app.use(function(req, res, next) 
{
    next(createError(404));
});

// Error handler
app.use(function(err, req, res)
{
    res.status(err.status || 500).json({
        error: err.message
    });
});

cronMain.start();

module.exports = app;
