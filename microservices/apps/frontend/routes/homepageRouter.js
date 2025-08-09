const express = require('express');
const path = require('path');
const homepageRouter = express.Router();

homepageRouter.get('/', (req, res) => 
{
    res.sendFile(path.join(__dirname, '../public/html', 'subscribe.html'));
});

module.exports = homepageRouter;
