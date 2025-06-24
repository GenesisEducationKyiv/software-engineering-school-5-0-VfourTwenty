const readline = require('readline');
const { Sequelize, Op } = require('sequelize');
const { WeatherCity, WeatherData } = require('../src/db/models'); // adjust if needed
const SubscriptionRepo = require('../src/repositories/subscriptionRepo');
const { incrementCityCounter } = require('../src/utils/subtracker'); // adjust if needed
const crypto = require('crypto');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function ask(question) {
    return new Promise(resolve => rl.question(question, answer => resolve(answer.trim())));
}

async function clearTables() {
    console.log('⚠️  Clearing all data...');

    await Promise.all([
        SubscriptionRepo.destroy({}),
        WeatherData.destroy({ where: {}, truncate: true, cascade: true }),
        WeatherCity.destroy({ where: {}, truncate: true, cascade: true }),
    ]);

    console.log('✅ All tables cleared: Subscription, WeatherData, WeatherCity.');
}

async function promptAndSeed() {
    const emailsInput = await ask('Enter one or more email addresses (comma separated): ');
    const emails = emailsInput.split(',').map(e => e.trim()).filter(e => e.includes('@'));
    if (emails.length === 0) {
        console.error('❌ No valid emails entered. Aborting.');
        process.exit(1);
    }

    const citiesInput = await ask('Enter cities (comma separated) or leave blank for defaults [London,Tokyo,Paris]: ');
    const defaultCities = ['London', 'Tokyo', 'Paris'];
    const cities = citiesInput ? citiesInput.split(',').map(c => c.trim()) : defaultCities;

    const frequency = await ask('Enter frequency (hourly/daily, default: daily): ') || 'daily';
    if (!['hourly', 'daily'].includes(frequency)) {
        console.error('❌ Invalid frequency. Must be "hourly" or "daily".');
        process.exit(1);
    }

    const count = parseInt(await ask('How many subscriptions to create per email? (default 1): '), 10) || 1;

    const confirmNow = (await ask('Confirm subscriptions now? (y/n): ')).toLowerCase() === 'y';

    for (const email of emails) {
        for (let i = 0; i < count; i++) {
            const city = cities[i % cities.length];
            const token = crypto.randomBytes(16).toString('hex');

            await SubscriptionRepo.create({
                email,
                city,
                frequency,
                confirmed: confirmNow,
                token,
            });

            await incrementCityCounter(city, frequency);
        }
    }

    console.log(`✅ Created ${emails.length * count} subscriptions.`);
}

async function confirmAllUnconfirmed() {
    const confirm = (await ask('Confirm all unconfirmed subscriptions? (y/n): ')).toLowerCase() === 'y';
    if (!confirm) return;

    const updated = await SubscriptionRepo.update(
        { confirmed: true },
        { confirmed: false }
    );

    console.log(`✅ Confirmed ${updated[0]} subscriptions.`);
}

async function main() {
    const action = await ask('\nChoose an action:\n1) Clear all\n2) Seed\n3) Confirm all unconfirmed\n> ');

    switch (action) {
        case '1':
            await clearTables();
            break;
        case '2':
            await promptAndSeed();
            break;
        case '3':
            await confirmAllUnconfirmed();
            break;
        default:
            console.log('❌ Invalid option.');
    }

    rl.close();
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
