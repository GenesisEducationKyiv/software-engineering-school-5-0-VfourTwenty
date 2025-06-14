const express = require('express');
const publicRouter = express.Router();

const {homepageController, confirmPublicController, unsubscribePublicController} = require('../controllers/publicController');


publicRouter.get('/', homepageController);

publicRouter.get('/confirm/:token', confirmPublicController);

publicRouter.get('/unsubscribe/:token', unsubscribePublicController);


module.exports = publicRouter;
