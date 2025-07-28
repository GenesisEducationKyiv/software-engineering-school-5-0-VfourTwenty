const { chromium } = require('playwright');
const { expect } = require('chai');
const { spawn, exec } = require('child_process');

// Import the real app and service/repo for E2E
const app = require('../../src/app');
const { subscriptionService, subscriptionRepo } = require('../../src/setup');

// port 3000 for docker, 3001 for local runs
const PORT = process.env.NODE_ENV === 'docker_test' ? '3000' : '3001';
const host = process.env.NODE_ENV === 'docker_test' ? 'backend-test' : 'localhost';
const baseURL = `http://${host}:${PORT}`;
const confirmUrl = (token) => `${baseURL}/confirm/${token}`
const unsubscribeUrl = (token) => `${baseURL}/unsubscribe/${token}`

function delay(ms) {
    return new Promise((res) => setTimeout(res, ms));
}

let serverProcess;

const sub = {
    email: 'test@example.com',
    city: 'Brighton',
    frequency: 'daily',
    confirmed: false
}

// needed without docker
// ( I know it's not perfect... (￣ ￣) )
if (process.env.NODE_ENV !== 'docker_test')
{
    before(function (done) {
        this.timeout(10000);

        serverProcess = spawn('npm', ['start'], {
            env: { ...process.env, NODE_ENV: process.env.NODE_ENV || 'test' },
            stdio: 'inherit',
        });

        setTimeout(done, 3000);
    });

    after((done) => {
        // npm process
        if (serverProcess) {
            console.log("Killing server", serverProcess.pid);
            serverProcess.kill('SIGKILL');
        }
        // node server
        exec(`lsof -ti :${PORT} | xargs kill`, (err, stdout, stderr) => {
            if (err && err.code !== 1) { // Ignore exit code 1 (no process found)
                console.error(`Error killing process on port ${PORT}: ${err}`);
            } else if (stderr) {
                console.error(`Error output: ${stderr}`);
            } else {
                console.log(`Successfully killed process on port ${PORT}`);
            }
            done();
        });
    });
}


describe('SkyFetch E2E Tests', () => {
    let browser;
    let page;

    // Set up browser and page before tests
    before(async () => {
        browser = await chromium.launch({ headless: true });
        page = await browser.newPage();
    });

    // Clean up after tests
    after(async () => {
        await browser.close();
    });

    // Subscription page ------------------------------------ \
    it('should display all input fields and submit button on homepage', async () => {
        await page.goto(baseURL);
        await expect(page.url()).to.equal(baseURL + '/');

        // Check email input
        await expect(await page.isVisible('input[name="email"]')).to.equal(true);
        await expect(await page.getAttribute('input[name="email"]', 'placeholder')).to.equal('Your email');

        // Check city input
        await expect(await page.isVisible('input[name="city"]')).to.equal(true);
        await expect(await page.getAttribute('input[name="city"]', 'placeholder')).to.equal('City');

        // Check frequency select
        await expect(await page.isVisible('select[name="frequency"]')).to.equal(true);
        await expect(await page.textContent('select[name="frequency"] option[value=""]')).to.equal('Frequency');

        // Check submit button
        await expect(await page.isVisible('button[type="submit"]')).to.equal(true);
        await expect(await page.textContent('button[type="submit"]')).to.equal('Subscribe');
    });

    it('should handle subscription form submission and show success message', async () => {
        await subscriptionRepo.clear();
        await page.goto(baseURL);
        await expect(page.url()).to.equal(baseURL + '/');

        // Fill out the form
        await page.fill('input[name="email"]', sub.email);
        await page.fill('input[name="city"]', sub.city);
        await page.selectOption('select[name="frequency"]', sub.frequency);
        await page.click('button[type="submit"]');

        // Verify no redirect (still on homepage)
        await expect(page.url()).to.equal(baseURL + '/');

        // Verify success message in #message div
        await expect(await page.textContent('#message')).to.equal('Validating city...');

        // Wait for success message (up to 3 seconds to account for API delay)
        await delay(5000);

        await expect(await page.textContent('#message')).to.equal('Subscription successful. Confirmation email sent.');
    });

    it('should reject subscription for invalid city and show a message', async () => {
        await subscriptionRepo.clear();
        await page.goto(baseURL);
        await expect(page.url()).to.equal(baseURL + '/');

        // Fill out the form
        await page.fill('input[name="email"]', sub.email);
        await page.fill('input[name="city"]', 'gkhghfgh');
        await page.selectOption('select[name="frequency"]', sub.frequency);
        await page.click('button[type="submit"]');

        // Verify no redirect (still on homepage)
        await expect(page.url()).to.equal(baseURL + '/');

        // Verify success message in #message div
        await expect(await page.textContent('#message')).to.equal('Validating city...');

        // Wait for success message (up to 3 seconds to account for API delay)
        await delay(6000);

        await expect(await page.textContent('#message')).to.equal('❌ Invalid city: No weather data available for this location');
    });

    it('should reject duplicate subscription and show a message', async () => {
        await subscriptionRepo.clear();
        await page.goto(baseURL);
        await expect(page.url()).to.equal(baseURL + '/');

        await subscriptionService.subscribeUser(sub.email, sub.city, sub.frequency);
        // Fill out the form
        await page.fill('input[name="email"]', sub.email);
        await page.fill('input[name="city"]', sub.city);
        await page.selectOption('select[name="frequency"]', sub.frequency);
        await page.click('button[type="submit"]');

        // Verify no redirect (still on homepage)
        await expect(page.url()).to.equal(baseURL + '/');

        // Verify success message in #message div
        await expect(await page.textContent('#message')).to.equal('Validating city...');

        // Wait for success message (up to 3 seconds to account for API delay)
        await delay(5000);

        await expect(await page.textContent('#message')).to.equal('Subscription already exists for this city and frequency.');
    });

    it('should not allow submission if not all fields are filled', async () => {
        await subscriptionRepo.clear();
        await page.goto(baseURL);
        await expect(page.url()).to.equal(baseURL + '/');

        await page.click('button[type="submit"]');
        await expect(page.url()).to.equal(baseURL + '/');
        await expect(await page.textContent('#message')).to.equal('');

        await page.fill('input[name="email"]', sub.email);
        await expect(page.url()).to.equal(baseURL + '/');
        await expect(await page.textContent('#message')).to.equal('');

        await page.selectOption('select[name="frequency"]', sub.frequency);
        await page.fill('input[name="email"]', '');
        await expect(page.url()).to.equal(baseURL + '/');
        await expect(await page.textContent('#message')).to.equal('');
    });

    it('should not allow submission if email format is invalid', async () => {
        await subscriptionRepo.clear();
        await page.goto(baseURL);
        await expect(page.url()).to.equal(baseURL + '/');

        await page.fill('input[name="email"]', 'jhkhhj');
        await page.fill('input[name="city"]', sub.city);
        await page.selectOption('select[name="frequency"]', sub.frequency);
        await page.click('button[type="submit"]');

        await expect(page.url()).to.equal(baseURL + '/');
        await expect(await page.textContent('#message')).to.equal('');
    });

    // Confirmation page ------------------------------------ \
    it('should confirm a new subscription with a valid token', async () => {
        await subscriptionRepo.clear();
        const result = await subscriptionService.subscribeUser(sub.email, sub.city, sub.frequency);
        const token = result.subscription.token;
        const url = confirmUrl(token);
        console.log('Navigating to confirm URL:', url);
        let redirectDetected = false;
        page.on('response', response => {
            if (response.url().includes('/confirm/') && response.status() === 302) {
                console.log('Redirect detected with status 302 for confirm URL');
                redirectDetected = true;
            }
        });
        await page.goto(url, { timeout: 10000 });
        await delay(2000);
        await expect(redirectDetected).to.equal(true, 'Expected a 302 redirect during confirmation');
        await expect(page.url()).to.equal(baseURL + `/confirmed.html?city=${sub.city}&frequency=${sub.frequency}&token=${token}`);
        const headerText = await page.textContent('h1');
        await expect(headerText).to.include('Your subscription is confirmed!', 'Expected confirmation page header');
    });

    // Unsubscribed page ------------------------------------ \
    it('should unsubscribe a user with a valid token', async () => {

        await subscriptionRepo.clear();
        const result = await subscriptionService.subscribeUser(sub.email, sub.city, sub.frequency);
        const token = result.subscription.token;
        await subscriptionService.confirmSubscription(token);
        const url = `${baseURL}/unsubscribe/${token}`;
        console.log('Navigating to unsubscribe URL:', url);
        let redirectDetected = false;
        page.on('response', response => {
            if (response.url().includes('/unsubscribe/') && response.status() === 302) {
                console.log('Redirect detected with status 302 for unsubscribe URL');
                redirectDetected = true;
            }
        });
        await page.goto(url, { timeout: 10000 });
        await delay(2000);
        await expect(redirectDetected).to.equal(true, 'Expected a 302 redirect during unsubscription');
        await expect(page.url()).to.equal(baseURL + '/unsubscribed.html');
        const unsubscribeHeaderText = await page.textContent('h1');
        await expect(unsubscribeHeaderText).to.include('You\'ve successfully unsubscribed!', 'Expected unsubscription page header');
    });

    // Error page ------------------------------------ \
    it('should not not allow duplicate confirmation and navigate to error page', async () => {
        await subscriptionRepo.clear();
        const result = await subscriptionService.subscribeUser(sub.email, sub.city, sub.frequency);
        const token = result.subscription.token;
        await subscriptionService.confirmSubscription(token);
        console.log('Navigating to confirm URL for duplicate check:', confirmUrl(token));
        try {
            await page.goto(confirmUrl(token), { timeout: 10000 });
        } catch (error) {
            console.error('Error navigating to confirm URL for duplicate check:', error.message);
            console.log('Retrying navigation...');
            await page.goto(confirmUrl(token), { timeout: 10000 });
        }
        await expect(page.url()).to.equal(baseURL + `/error.html?error=Subscription+already+confirmed`);
        await expect(await page.textContent('#error-message')).to.equal('Subscription already confirmed');
    });

    it('should require a valid token and navigate to error page if one is missing', async () => {

        const invalidToken = 'fgdfgdsf';

        console.log('Navigating to confirm URL with invalid token:', confirmUrl(invalidToken));
        try {
            await page.goto(confirmUrl(invalidToken), { timeout: 10000 });
        } catch (error) {
            console.error('Error navigating to confirm URL with invalid token:', error.message);
            console.log('Retrying navigation...');
            await page.goto(confirmUrl(invalidToken), { timeout: 10000 });
        }
        await expect(page.url()).to.equal(baseURL + '/error.html?error=Invalid+token');
        await expect(await page.textContent('#error-message')).to.equal('Invalid token');

        console.log('Navigating to unsubscribe URL with invalid token:', unsubscribeUrl(invalidToken));
        try {
            await page.goto(unsubscribeUrl(invalidToken), { timeout: 10000 });
        } catch (error) {
            console.error('Error navigating to unsubscribe URL with invalid token:', error.message);
            console.log('Retrying navigation...');
            await page.goto(unsubscribeUrl(invalidToken), { timeout: 10000 });
        }
        await expect(page.url()).to.equal(baseURL + '/error.html?error=Invalid+token');
        await expect(await page.textContent('#error-message')).to.equal('Invalid token');
    });

    it('should not allow to reuse a token that was deleted and should navigate to error page', async () => {
        await subscriptionRepo.clear();
        const result = await subscriptionService.subscribeUser(sub.email, sub.city, sub.frequency);
        const token = result.subscription.token;
        await subscriptionService.unsubscribeUser(token);
        console.log('Navigating to confirm URL with deleted token:', confirmUrl(token));
        try {
            await page.goto(confirmUrl(token), { timeout: 10000 });
        } catch (error) {
            console.error('Error navigating to confirm URL with deleted token:', error.message);
            console.log('Retrying navigation...');
            await page.goto(confirmUrl(token), { timeout: 10000 });
        }
        await expect(page.url()).to.equal(baseURL + '/error.html?error=Token+not+found');
        await expect(await page.textContent('#error-message')).to.equal('Token not found');
        console.log('Navigating to unsubscribe URL with deleted token:', unsubscribeUrl(token));
        try {
            await page.goto(unsubscribeUrl(token), { timeout: 10000 });
        } catch (error) {
            console.error('Error navigating to unsubscribe URL with deleted token:', error.message);
            console.log('Retrying navigation...');
            await page.goto(unsubscribeUrl(token), { timeout: 10000 });
        }
        await expect(page.url()).to.equal(baseURL + '/error.html?error=Token+not+found');
        await expect(await page.textContent('#error-message')).to.equal('Token not found');
    });

});