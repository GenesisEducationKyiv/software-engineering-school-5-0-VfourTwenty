const express = require('express');
const proxyRouter = express.Router();

proxyRouter.use('/api', async (req, res) => 
{
    try 
    {
        console.log('req body: ', req.body);
        console.log('req method: ', req.method);
        const backendUrl = `http://backend:4000${req.originalUrl}`;
        console.log(`[PROXY] ${req.method} ${req.originalUrl} -> ${backendUrl}`);

        const data = JSON.stringify(req.body);
        console.log('preparing to send data in proxy: ', data);
        const backendRes = await fetch(backendUrl, {
            method: req.method,
            headers: { 'Content-Type': 'application/json' },
            body: data,
        });

        const resData = await backendRes.json();
        console.log('response from back in front: ', resData);
        console.log('response status: ', backendRes.status);

        res.status(backendRes.status);
        res.json(resData);
    }
    catch (err) 
    {
        console.error('[PROXY ERROR]', err);
        res.status(500).send('Proxy error');
    }
});

module.exports = proxyRouter;
