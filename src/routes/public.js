const express = require('express');
const publicRouter = express.Router();

const { homepageController} = require('../controllers/homepageController');
const { confirmPublicController, unsubscribePublicController } = require('../controllers/subscriptionPublicController');


publicRouter.get('/', homepageController);

publicRouter.get('/confirm/:token', confirmPublicController);

publicRouter.get('/unsubscribe/:token', unsubscribePublicController);


module.exports = publicRouter;
