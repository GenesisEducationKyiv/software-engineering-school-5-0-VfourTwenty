const express = require('express');
const router = express.Router();
const { subscribeController, confirmController, unsubscribeController } = require('../controllers/subscriptionController');


// subscription
router.post('/subscribe', subscribeController);

// confirmation
router.get('/confirm/:token', confirmController);

// cancel subscription
router.get('/unsubscribe/:token', unsubscribeController);


module.exports = router;
