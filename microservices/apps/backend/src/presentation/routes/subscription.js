const express = require('express');
const router = express.Router();
const { subscriptionController } = require('../../../setup');

// subscription
router.post('/subscribe', subscriptionController.subscribe);

// confirmation
router.get('/confirm/:token', subscriptionController.confirm);

// cancel subscription
router.get('/unsubscribe/:token', subscriptionController.unsubscribe);

module.exports = router;
