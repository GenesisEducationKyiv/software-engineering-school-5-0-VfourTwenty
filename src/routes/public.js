const express = require('express');
const publicRouter = express.Router();

const HomepageController = require('../controllers/homepageController');
const SubscriptionPublicController = require('../controllers/subscriptionPublicController');


publicRouter.get('/', HomepageController.getStaticHomepage);

publicRouter.get('/confirm/:token', SubscriptionPublicController.confirm);

publicRouter.get('/unsubscribe/:token', SubscriptionPublicController.unsubscribe);


module.exports = publicRouter;
