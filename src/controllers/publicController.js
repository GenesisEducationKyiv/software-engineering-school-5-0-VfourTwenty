const { join } = require('path');

const { findSub } = require('../services/subscriptionService');
const env = process.env.NODE_ENV;
const config = require('../config/config.js')[env];

const homepageController = (req, res) => {
    res.sendFile(join(__dirname, '../public/subscribe.html'));
}

const confirmPublicController = async (req, res) => {
    const { token } = req.params;

    try {
        const apiUrl = `${config.baseUrl}/api/confirm/${token}`;
        console.log(apiUrl);
        const apiRes = await fetch(apiUrl, {
            headers: {
                'Accept': 'application/json',
            },
        });

        console.log("response status: ", apiRes.status);


        if (apiRes.status === 200) {
            const url = new URL(`${config.baseUrl}/confirmed.html`);
            const sub = await findSub({token: token});

            url.searchParams.set('city', sub.city || '');
            url.searchParams.set('frequency', sub.frequency || '');
            url.searchParams.set('token', token);

            return res.redirect(url.toString());
        } else {
            const errorData = await apiRes.json();
            const errorUrl = new URL(`${config.baseUrl}/error.html`);
            errorUrl.searchParams.set('error', errorData.error || 'Unknown error');
            return res.redirect(errorUrl.toString());
        }
    } catch (err) {
        console.error('Confirmation frontend error:', err);
        const errorUrl = new URL(`${config.baseUrl}/error.html`);
        errorUrl.searchParams.set('error', 'Internal server error 1');
        return res.redirect(errorUrl.toString());
    }
}

const unsubscribePublicController = async (req, res) => {
    const { token } = req.params;

    try {
        const apiUrl = `${config.baseUrl}/api/unsubscribe/${token}`;
        const apiRes = await fetch(apiUrl, {
            headers: {
                'Accept': 'application/json',
            },
        });

        if (apiRes.status === 200) {
            const url = new URL(`${config.baseUrl}/unsubscribed.html`);

            return res.redirect(url.toString());
        } else {
            const errorData = await apiRes.json();
            const errorUrl = new URL(`${config.baseUrl}/error.html`);
            errorUrl.searchParams.set('error', errorData.error || 'Unknown error');
            return res.redirect(errorUrl.toString());
        }
    } catch (err) {
        console.error('Unsubscribe frontend error:', err);
        const errorUrl = new URL(`${config.baseUrl}/error.html`);
        errorUrl.searchParams.set('error', 'Internal server error');
        return res.redirect(errorUrl.toString());
    }
}

module.exports = { homepageController, confirmPublicController, unsubscribePublicController };