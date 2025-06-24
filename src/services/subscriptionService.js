const SubscriptionRepo = require('../repositories/subscriptionRepo');
const crypto = require('crypto');
const { incrementCityCounter, decrementCityCounter } = require('../utils/subtracker');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function genToken() {
    return crypto.randomBytes(20).toString('hex');
}

async function createSub(email, city, frequency) {
    if (!email || !city || !frequency) {
        throw new Error('MISSING REQUIRED FIELDS');
    }

    if (!emailRegex.test(email)) {
        throw new Error('INVALID EMAIL FORMAT');
    }

    if (!['hourly', 'daily'].includes(frequency)) {
        throw new Error('INVALID FREQUENCY');
    }

    const exists = await SubscriptionRepo.findOneBy({ email, city, frequency });

    if (exists)
    {
        throw new Error('DUPLICATE');
    }
    const token = genToken();

    await SubscriptionRepo.create({ email, city, frequency, confirmed: false, token });
    return token;
}

async function confirmSub(token) {
    if (!token || token.length < 10) throw new Error('INVALID TOKEN');
    const sub = await SubscriptionRepo.findOneBy({ token });
    if (!sub)  throw new Error('TOKEN NOT FOUND');
    if (sub.confirmed) throw new Error('ALREADY CONFIRMED');

    sub.confirmed = true;
    await SubscriptionRepo.saveInstance(sub);
    await incrementCityCounter(sub.city, sub.frequency);
    return sub;
}

async function deleteSub(token) {
    if (!token || token.length < 10) throw new Error('INVALID TOKEN');
    const sub = await SubscriptionRepo.findOneBy({ token });
    if (!sub) throw new Error('TOKEN NOT FOUND');

    await decrementCityCounter(sub.city, sub.frequency);
    await SubscriptionRepo.destroyInstance(sub);
    return sub;
}

async function findSub(params)
{
    return await SubscriptionRepo.findOneBy(params);
}

module.exports = { createSub, confirmSub, deleteSub, findSub };
