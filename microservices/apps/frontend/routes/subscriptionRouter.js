const express = require('express');
const SubscriptionController = require('../controllers/subscriptionController');
const subscriptionRouter = express.Router();

// no separate composition root for now as this is the only class init
const subscriptionController = new SubscriptionController();

subscriptionRouter.get('/confirm/:token', subscriptionController.confirm);
subscriptionRouter.get('/unsubscribe/:token', subscriptionController.unsubscribe);

module.exports = subscriptionRouter;