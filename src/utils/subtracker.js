const WeatherCityRepo = require('../repositories/weatherCityRepo');

// track the number of subscriptions per city per type (hourly/daily)
async function incrementCityCounter(city, frequency) {
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

// decrement on unsubscribe
async function decrementCityCounter(city, frequency) {
    const cityEntry = await WeatherCityRepo.findOneBy({ city });
    if (!cityEntry) return;

    if (frequency === 'daily') cityEntry.daily_count -= 1;
    if (frequency === 'hourly') cityEntry.hourly_count -= 1;

    // delete the entry if both counters reach 0
    if (cityEntry.daily_count <= 0 && cityEntry.hourly_count <= 0) {
        await cityEntry.destroy();
    } else {
        // Prevent negatives
        cityEntry.daily_count = Math.max(0, cityEntry.daily_count);
        cityEntry.hourly_count = Math.max(0, cityEntry.hourly_count);
        await WeatherCityRepo.saveInstance(cityEntry);
    }
}

module.exports = {
    incrementCityCounter,
    decrementCityCounter
};