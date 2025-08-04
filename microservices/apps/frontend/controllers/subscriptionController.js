const {buildConfirmedUrl, buildErrorUrl, buildUnsubscribedUrl} = require("../utils/redirectUtils");

class SubscriptionController
{
    confirm = async (req, res) => {
        const { token } = req.params;
        try {
            const fetchRes = await fetch(`http://backend:4000/api/confirm/${token}`);
            console.log('confirm fetch result: ', fetchRes);
            const resJson = await fetchRes.json();
            let url;
            if (fetchRes.status === 200)
            {
                const sub = resJson.data;
                url = buildConfirmedUrl(sub.city, sub.frequency, token);
            }
            else
            {
                const error = resJson.err;
                url = buildErrorUrl(error);
            }
            return res.redirect(url);
        }
        catch (err)
        {
            console.log('error fetching api confirm: ', err);
        }
    }

    unsubscribe = async (req, res) =>
    {
        const { token } = req.params;
        try {
            const fetchRes = await fetch(`http://backend:4000/api/unsubscribe/${token}`);
            console.log('confirm fetch result: ', fetchRes);
            const resJson = await fetchRes.json();
            let url;
            if (fetchRes.status === 200)
            {
                url = buildUnsubscribedUrl();
            }
            else
            {
                const error = resJson.err;
                url = buildErrorUrl(error);
            }
            return res.redirect(url);
        }
        catch (err)
        {
            console.log('error fetching api unsubscribe: ', err);
        }
    }
}

module.exports = SubscriptionController;