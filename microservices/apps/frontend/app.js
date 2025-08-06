const express = require('express');
const path = require('path');
const proxyRouter = require('./routes/proxyRouter');
const homepageRouter = require('./routes/homepageRouter');
const subscriptionRouter = require('./routes/subscriptionRouter');

const app = express();

app.use(express.json());
app.use(express.static('public'));

app.use('/', proxyRouter);
app.use('/', homepageRouter);
app.use('/', subscriptionRouter);

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
    console.log(`Frontend running on port ${PORT}`);
});