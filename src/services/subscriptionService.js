const SubscriptionRepo = require('../repositories/subscriptionRepo');
const WeatherCityRepo = require("../repositories/weatherCityRepo");
const { emailRegex, genToken } = require('../utils/strings');

class SubscriptionService {

    static async createSub(email, city, frequency) {
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

        if (exists) {
            throw new Error('DUPLICATE');
        }
        const token = genToken();

        await SubscriptionRepo.create({ email, city, frequency, confirmed: false, token });
        return token;
    }

    static async confirmSub(token) {
        if (!token || token.length < 10) throw new Error('INVALID TOKEN');
        const sub = await SubscriptionRepo.findOneBy({ token });
        if (!sub)  throw new Error('TOKEN NOT FOUND');
        if (sub.confirmed) throw new Error('ALREADY CONFIRMED');

        sub.confirmed = true;
        await SubscriptionRepo.saveInstance(sub);
        await SubscriptionService.incrementCityCounter(sub.city, sub.frequency);
        return sub;
    }

    static async deleteSub(token) {
        if (!token || token.length < 10) throw new Error('INVALID TOKEN');
        const sub = await SubscriptionRepo.findOneBy({ token });
        if (!sub) throw new Error('TOKEN NOT FOUND');

        await SubscriptionService.decrementCityCounter(sub.city, sub.frequency);
        await SubscriptionRepo.destroyInstance(sub);
        return sub;
    }

    static async findSub(params) {
        return await SubscriptionRepo.findOneBy(params);
    }

    static async incrementCityCounter(city, frequency) {
        const cityEntry = await WeatherCityRepo.findOneBy({ city });

        if (!cityEntry) {
            await WeatherCityRepo.create({
                city,
                hourly_count: frequency === 'hourly' ? 1 : 0,
                daily_count: frequency === 'daily' ? 1 : 0,
            });
        } else {
            if (frequency === 'hourly') cityEntry.hourly_count += 1;
            if (frequency === 'daily') cityEntry.daily_count += 1;
            await WeatherCityRepo.saveInstance(cityEntry);
        }
    }

    static async decrementCityCounter(city, frequency) {
        const cityEntry = await WeatherCityRepo.findOneBy({city});
        if (!cityEntry) return;

        if (frequency === 'daily') cityEntry.daily_count -= 1;
        if (frequency === 'hourly') cityEntry.hourly_count -= 1;

        // delete the entry if both counters reach 0
        if (cityEntry.daily_count <= 0 && cityEntry.hourly_count <= 0) {
            await WeatherCityRepo.destroyInstance(cityEntry);
        } else {
            // Prevent negatives
            cityEntry.daily_count = Math.max(0, cityEntry.daily_count);
            cityEntry.hourly_count = Math.max(0, cityEntry.hourly_count);
            await WeatherCityRepo.saveInstance(cityEntry);
        }
    }
}

module.exports = SubscriptionService;
