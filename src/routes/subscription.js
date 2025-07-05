const express = require('express');
const router = express.Router();
const SubscriptionController = require('../controllers/subscriptionApiController');


// subscription
router.post('/subscribe', SubscriptionController.subscribe);

// confirmation
router.get('/confirm/:token', SubscriptionController.confirm);

// cancel subscription
router.get('/unsubscribe/:token', SubscriptionController.unsubscribe);


module.exports = router;
