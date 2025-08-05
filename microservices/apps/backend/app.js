const express = require('express');
const app = express();
app.use(express.json());

const { cronMain } = require('./setup');

const weatherRouter = require('./src/presentation/routes/weather');
const subscriptionRouter = require('./src/presentation/routes/subscription');

app.use('/api', weatherRouter);
app.use('/api', subscriptionRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});

cronMain.start();