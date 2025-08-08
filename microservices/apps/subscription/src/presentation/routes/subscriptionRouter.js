const express = require('express');
const { subscriptionController } = require('../../../setup');

const subscriptionRouter = express.Router();

subscriptionRouter.post('/subscribe', subscriptionController.subscribe);
subscriptionRouter.post('/confirm', subscriptionController.confirm);
subscriptionRouter.post('/unsubscribe', subscriptionController.unsubscribe);
subscriptionRouter.get('/find-sub', subscriptionController.findSub);
subscriptionRouter.get('/find-all-subs', subscriptionController.findAllSubs);
subscriptionRouter.post('/test/clear', subscriptionController.clear);

module.exports = subscriptionRouter;