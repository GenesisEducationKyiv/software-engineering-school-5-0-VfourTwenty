const express = require('express');
const router = express.Router();
const { subscriptionApiController } = require('../../setup');

// subscription
router.post('/subscribe', subscriptionApiController.subscribe);

// confirmation
router.get('/confirm/:token', subscriptionApiController.confirm);

// cancel subscription
router.get('/unsubscribe/:token', subscriptionApiController.unsubscribe);

module.exports = router;
