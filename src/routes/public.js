const express = require('express');
const publicRouter = express.Router();

const { homepageController, subscriptionPublicController } = require('../setup');

publicRouter.get('/', homepageController.getStaticHomepage);

publicRouter.get('/confirm/:token', subscriptionPublicController.confirm);

publicRouter.get('/unsubscribe/:token', subscriptionPublicController.unsubscribe);

module.exports = publicRouter;
