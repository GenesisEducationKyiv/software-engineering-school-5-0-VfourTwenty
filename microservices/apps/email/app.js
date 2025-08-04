const express = require('express');
const app = express();
app.use(express.json())

const emailRouter = require('./src/presentation/routes/emailRouter');

app.use('/', emailRouter);

const PORT = process.env.PORT || 4004;
app.listen(PORT, () => {
    console.log(`Email service running on port ${PORT}`);
});