const express = require('express');
const app = express();
app.use(express.json());

const subscriptionRouter = require('./src/presentation/routes/subscriptionRouter');

app.use('/api', subscriptionRouter);

const PORT = process.env.PORT || 4003;
app.listen(PORT, () => 
{
    console.log(`Subscription running on port ${PORT}`);
});
