const ISubscriptionService = require('../../domain/interfaces/subscriptionServiceInterface');
const Result = require("../../domain/types/result");
const config = require("../../common/config");

class SubscriptionService extends ISubscriptionService
{
    async subscribeUser(email, city, frequency)
    {
        console.log('entered subscription service on backend, url for fetch: ', config.subscriptionUrl);
        try {
            const subscriptionRes = await fetch(`${config.subscriptionUrl}/subscribe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    city,
                    frequency
                })
            });

            console.log('subscription status: ', subscriptionRes.status);
            const subResJson = await subscriptionRes.json();
            console.log('subscription in sub service in backend', subResJson)
            if (subscriptionRes.status !== 200) return new Result(false, subResJson.error);
            return subResJson;
        }
        catch (err)
        {
            console.error('error happened', err)
            return new Result(false, 'error in subscribe controller');
        }
    }

    async confirmSubscription(token)
    {
        try {
            const confirmationRes = await fetch(`${config.subscriptionUrl}/confirm`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token
                })
            });
            console.log('confirmation status: ', confirmationRes.status);
            const confirmResJson = await confirmationRes.json();
            console.log('confirmation in sub service in backend', confirmResJson)
            if (confirmationRes.status !== 200) return new Result(false, confirmResJson.error);
            return confirmResJson;
        }
        catch (err)
        {
            console.error('error happened', err)
            return new Result(false, 'error in confirm controller');
        }
    }

    async unsubscribeUser(token)
    {
        try {
            const unsubscribeRes = await fetch(`${config.subscriptionUrl}/unsubscribe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token
                })
            });
            console.log('unsubscribe status: ', unsubscribeRes.status);
            const unsubscribeResJson = await unsubscribeRes.json();
            console.log('unsubscribe in sub service in backend', unsubscribeResJson)
            if (unsubscribeRes.status !== 200) return new Result(false, unsubscribeResJson.error);
            return unsubscribeResJson;
        }
        catch (err)
        {
            console.error('error happened', err)
            return new Result(false, 'error in unsubscribe controller');
        }
    }

    async findSub(params)
    {
        try {
            const queryString = new URLSearchParams(params).toString();
            const url = `${config.subscriptionUrl}/find-sub?${queryString}`;
            const findSubRes = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('findSub status: ', findSubRes.status);
            const findSubResJson = await findSubRes.json();
            console.log('unsubscribe in sub service in backend', findSubRes)
            if (findSubRes.status !== 200) return new Result(false, findSubResJson.error);
            return findSubResJson;
        }
        catch (err)
        {
            console.error('error happened', err)
            return new Result(false, 'error in unsubscribe controller');
        }
    }

    async findAllSubs(params)
    {
        try {
            const queryString = new URLSearchParams(params).toString();
            const url = `${config.subscriptionUrl}/find-all-subs?${queryString}`;
            const findAllSubsRes = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('findAllSubsSub status: ', findAllSubsRes.status);
            const findAllSubsResJson = await findAllSubsRes.json();
            console.log('unsubscribe in sub service in backend', findAllSubsRes)
            if (findAllSubsRes.status !== 200) return new Result(false, findAllSubsResJson.error);
            return findAllSubsResJson;
        }
        catch (err)
        {
            console.error('error happened', err)
            return new Result(false, 'error in unsubscribe controller');
        }
    }
}

module.exports = SubscriptionService;