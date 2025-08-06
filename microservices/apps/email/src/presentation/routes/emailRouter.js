const express = require("express");
const { emailController } = require("../../../setup");

const emailRouter = express.Router();
emailRouter.post('/api/send-email', (req, res, next) => {
    console.log('hitting /api/send-email');
    next();
}, emailController.sendEmail);

module.exports = emailRouter;