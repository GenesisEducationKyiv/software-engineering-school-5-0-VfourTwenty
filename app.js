const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const createError = require('http-errors');

const weatherRouter = require('./routes/weather');
const subscriptionRouter = require('./routes/subscription');
const publicRouter = require('./routes/public')

const app = express();
const cron = require('node-cron');

const { fetchHourlyWeather, fetchDailyWeather } = require ('./utils/fetchweather');
const { sendUpdates } = require('./utils/mailer');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Mount routes
app.use('/api', weatherRouter);
app.use('/api', subscriptionRouter);

// public route
app.use('/', publicRouter);

// 404 handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res) {
  res.status(err.status || 500).json({
    error: err.message
  });
});


cron.schedule('0 * * * *', async () => {
  console.log('Running hourly weather job...');
  try {
    await fetchHourlyWeather();
    console.log("hourly weather fetched");
    await sendUpdates('hourly');
  } catch (err) {
    console.error('❌ Hourly job failed:', err.message || err);
  }
});

cron.schedule('0 11 * * *', async () => {
  console.log('Running daily weather job...');
  try {
    await fetchDailyWeather();
    await sendUpdates('daily');
  } catch (err) {
    console.error('❌ Daily job failed:', err.message || err);
  }
});

module.exports = app;
