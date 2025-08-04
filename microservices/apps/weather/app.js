const express = require('express');
const app = express();

const weatherRouter = require('./src/presentation/routes/weatherRouter');

app.use('/', weatherRouter);

const PORT = process.env.PORT || 4002;
app.listen(PORT, () => {
    console.log(`Weather service running on port ${PORT}`);
});