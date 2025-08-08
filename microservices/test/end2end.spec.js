// e2e.spec.js
const { test, expect } = require('@playwright/test');

const baseURL = process.env.BASE_URL || 'http://frontend:4001';
const confirmUrl = (token) => `${baseURL}/confirm/${token}`;
const unsubscribeUrl = (token) => `${baseURL}/unsubscribe/${token}`;

const sub = {
    email: 'test@example.com',
    city: 'Paris',
    frequency: 'daily'
};

test.beforeEach(async ({ request }) => {
    const response = await request.post('http://subscription:4003/api/test/clear');
    expect(response.ok()).toBeTruthy();
});

test.describe('SkyFetch E2E Tests', () => {
    test('should display all input fields and submit button on homepage', async ({ page }) => {
        await page.goto(baseURL);

        await expect(page).toHaveURL(baseURL + '/');

        await expect(page.locator('input[name="email"]')).toBeVisible();
        await expect(page.locator('input[name="email"]')).toHaveAttribute('placeholder', 'Your email');

        await expect(page.locator('input[name="city"]')).toBeVisible();
        await expect(page.locator('input[name="city"]')).toHaveAttribute('placeholder', 'City');

        await expect(page.locator('select[name="frequency"]')).toBeVisible();
        await expect(page.locator('select[name="frequency"] option[value=""]')).toHaveText('Frequency');

        await expect(page.locator('button[type="submit"]')).toBeVisible();
        await expect(page.locator('button[type="submit"]')).toHaveText('Subscribe');
    });

    test('should show a confirmation message after subscribing', async ({ page }) => {
        await page.goto(baseURL);

        await page.fill('input[name="email"]', sub.email);
        await page.fill('input[name="city"]', sub.city);
        await page.selectOption('select[name="frequency"]', sub.frequency);
        await page.click('button[type="submit"]');

        await page.waitForTimeout(3000);

        const message = await page.textContent('#message');
        expect(message).toBe('Subscription successful. Confirmation email sent.');
    });

    test('should reject subscription for invalid city and show a message', async ({ page }) => {
        await page.goto(baseURL);
        await expect(page).toHaveURL(baseURL + '/');

        await page.fill('input[name="email"]', `invalid-city-${Date.now()}@example.com`);
        await page.fill('input[name="city"]', 'noTaValIDciTY');
        await page.selectOption('select[name="frequency"]', 'daily');
        await page.click('button[type="submit"]');

        // Allow time for backend to respond
        await page.waitForTimeout(6000);

        const message = await page.textContent('#message');
        expect(message).toBe('Invalid city.');
    });

    test('should reject duplicate subscription and show a message', async ({ page, request }) => {
        const email = `dupe-${Date.now()}@example.com`;

        await page.goto(baseURL);
        await expect(page).toHaveURL(baseURL + '/');

        const subscribeRes = await request.post(`${baseURL}/api/subscribe`, {
            data: {
                email: sub.email,
                city: sub.city,
                frequency: sub.frequency
            }
        });
        expect(subscribeRes.ok()).toBeTruthy();

        await page.fill('input[name="email"]', sub.email);
        await page.fill('input[name="city"]', 'Paris');
        await page.selectOption('select[name="frequency"]', 'daily');
        await page.click('button[type="submit"]');
        await page.waitForTimeout(5000);

        const message = await page.textContent('#message');
        expect(message).toBe('Subscription already exists for this city and frequency.');
    });


    test('should not allow submission if not all fields are filled', async ({ page }) => {
        await page.goto(baseURL);
        await expect(page).toHaveURL(baseURL + '/');

        await page.click('button[type="submit"]');
        await expect(page).toHaveURL(baseURL + '/');
        await expect(page.locator('#message')).toHaveText('');

        await page.fill('input[name="email"]', sub.email);
        await expect(page).toHaveURL(baseURL + '/');
        await expect(page.locator('#message')).toHaveText('');

        await page.selectOption('select[name="frequency"]', sub.frequency);
        await page.fill('input[name="email"]', '');
        await expect(page).toHaveURL(baseURL + '/');
        await expect(page.locator('#message')).toHaveText('');
    });

    test('should not allow submission if email format is invalid', async ({ page }) => {
        await page.goto(baseURL);
        await expect(page).toHaveURL(baseURL + '/');

        await page.fill('input[name="email"]', 'jhkhhj');
        await page.fill('input[name="city"]', sub.city);
        await page.selectOption('select[name="frequency"]', sub.frequency);
        await page.click('button[type="submit"]');

        await expect(page).toHaveURL(baseURL + '/');
        await expect(page.locator('#message')).toHaveText('');
    });

    //     // Confirmation page ------------------------------------ \
    test('should confirm a new subscription with a valid token', async ({ page, request }) => {
        const subscribeRes = await request.post(`${baseURL}/api/subscribe`, {
            data: {
                email: sub.email,
                city: sub.city,
                frequency: sub.frequency
            }
        });
        expect(subscribeRes.ok()).toBeTruthy();

        const findSubRes = await request.get('http://subscription:4003/api/find-sub', {
            params: {
                email: sub.email,
                city: sub.city,
                frequency: sub.frequency
            }
        });
        const resJson = await findSubRes.json();
        const token = resJson.data.token;

        const response = await request.get(confirmUrl(token), { maxRedirects: 0 });
        expect(response.status()).toBe(302); // redirect to "subscription confirmed" page

        const location = response.headers()['location'];
        const regex = new RegExp(`/confirmed\\.html\\?city=${encodeURIComponent(sub.city)}&frequency=${encodeURIComponent(sub.frequency)}&token=${token}$`);
        expect(location).toMatch(regex);
        // swap frontend domain for docker service name
        const locationInDocker = location.replace(/^.*(?=\/html\/confirmed\.html)/, baseURL);

        await page.goto(locationInDocker, { waitUntil: 'domcontentloaded', timeout: 10000 });
        const headerText = await page.textContent('h1');
        expect(headerText).toContain('Your subscription is confirmed!');
    });

    // Unsubscribed page ------------------------------------ \
    test('should unsubscribe a user with a valid token', async ({ page, request }) => {
        const subscribeRes = await request.post(`${baseURL}/api/subscribe`, {
            data: {
                email: sub.email,
                city: sub.city,
                frequency: sub.frequency
            }
        });
        expect(subscribeRes.ok()).toBeTruthy();

        const findSubRes = await request.get('http://subscription:4003/api/find-sub', {
            params: {
                email: sub.email,
                city: sub.city,
                frequency: sub.frequency
            }
        });
        const resJson = await findSubRes.json();
        const token = resJson.data.token;

        const unsubscribeUrl = `${baseURL}/unsubscribe/${token}`;
        const unsubscribeRes = await request.get(unsubscribeUrl, { maxRedirects: 0 });
        expect(unsubscribeRes.status()).toBe(302);

        const location = unsubscribeRes.headers()['location'];
        const regex = /\/html\/unsubscribed\.html$/;
        expect(location).toMatch(regex);

        const locationInDocker = location.replace(/^.*(?=\/html\/unsubscribed\.html)/, baseURL);

        await page.goto(locationInDocker, { waitUntil: 'domcontentloaded', timeout: 10000 });
        const unsubscribeHeaderText = await page.textContent('h1');
        expect(unsubscribeHeaderText).toContain("You've successfully unsubscribed!");
    });

    // Error page ------------------------------------ \
    test('should not allow duplicate confirmation and navigate to error page', async ({ page, request }) => {
        // 1. Subscribe and confirm
        const subscribeRes = await request.post(`${baseURL}/api/subscribe`, {
            data: { email: sub.email, city: sub.city, frequency: sub.frequency }
        });
        expect(subscribeRes.ok()).toBeTruthy();

        const findSubRes = await request.get('http://subscription:4003/api/find-sub', {
            params: { email: sub.email, city: sub.city, frequency: sub.frequency }
        });
        const resJson = await findSubRes.json();
        const token = resJson.data.token;

        // 2. Confirm once
        await request.get(confirmUrl(token));

        // 3. Try to confirm again, expect redirect to error page
        const response = await request.get(confirmUrl(token), { maxRedirects: 0 });
        expect(response.status()).toBe(302);

        const location = response.headers()['location'];
        console.log('location ', location);
        // Regex for /html/error.html?error=Subscription+already+confirmed
        const regex = /\/html\/error\.html\?error=Subscription\+already\+confirmed$/;
        expect(location).toMatch(regex);

        // Swap everything before /html/error.html with baseURL
        const locationInDocker = location.replace(/^.*(?=\/html\/error\.html)/, baseURL);

        // 4. Go to the error page and assert content
        await page.goto(locationInDocker, { waitUntil: 'domcontentloaded', timeout: 10000 });
        await expect(page.locator('#error-message')).toHaveText('Subscription already confirmed');
    });
});

//     it('should not not allow duplicate confirmation and navigate to error page', async () =>
//     {
//         await subscriptionRepo.clear();
//         const result = await subscriptionService.subscribeUser(sub.email, sub.city, sub.frequency);
//         const token = result.data.token;
//         await subscriptionService.confirmSubscription(token);
//         console.log('Navigating to confirm URL for duplicate check:', confirmUrl(token));
//         try
//         {
//             await page.goto(confirmUrl(token), { timeout: 10000 });
//         }
//         catch (error)
//         {
//             console.error('Error navigating to confirm URL for duplicate check:', error.message);
//             console.log('Retrying navigation...');
//             await page.goto(confirmUrl(token), { timeout: 10000 });
//         }
//         await expect(page.url()).to.equal(baseURL + '/error.html?error=Subscription+already+confirmed');
//         await expect(await page.textContent('#error-message')).to.equal('Subscription already confirmed');
//     });
//
//     it('should require a valid token and navigate to error page if one is missing', async () =>
//     {
//         const invalidToken = 'fgdfgdsf';
//
//         console.log('Navigating to confirm URL with invalid token:', confirmUrl(invalidToken));
//         try
//         {
//             await page.goto(confirmUrl(invalidToken), { timeout: 10000 });
//         }
//         catch (error)
//         {
//             console.error('Error navigating to confirm URL with invalid token:', error.message);
//             console.log('Retrying navigation...');
//             await page.goto(confirmUrl(invalidToken), { timeout: 10000 });
//         }
//         await expect(page.url()).to.equal(baseURL + '/error.html?error=Invalid+token');
//         await expect(await page.textContent('#error-message')).to.equal('Invalid token');
//
//         console.log('Navigating to unsubscribe URL with invalid token:', unsubscribeUrl(invalidToken));
//         try
//         {
//             await page.goto(unsubscribeUrl(invalidToken), { timeout: 10000 });
//         }
//         catch (error)
//         {
//             console.error('Error navigating to unsubscribe URL with invalid token:', error.message);
//             console.log('Retrying navigation...');
//             await page.goto(unsubscribeUrl(invalidToken), { timeout: 10000 });
//         }
//         await expect(page.url()).to.equal(baseURL + '/error.html?error=Invalid+token');
//         await expect(await page.textContent('#error-message')).to.equal('Invalid token');
//     });
//
//     it('should not allow to reuse a token that was deleted and should navigate to error page', async () =>
//     {
//         await subscriptionRepo.clear();
//         const result = await subscriptionService.subscribeUser(sub.email, sub.city, sub.frequency);
//         const token = result.data.token;
//         await subscriptionService.unsubscribeUser(token);
//         console.log('Navigating to confirm URL with deleted token:', confirmUrl(token));
//         try
//         {
//             await page.goto(confirmUrl(token), { timeout: 10000 });
//         }
//         catch (error)
//         {
//             console.error('Error navigating to confirm URL with deleted token:', error.message);
//             console.log('Retrying navigation...');
//             await page.goto(confirmUrl(token), { timeout: 10000 });
//         }
//         await expect(page.url()).to.equal(baseURL + '/error.html?error=Token+not+found');
//         await expect(await page.textContent('#error-message')).to.equal('Token not found');
//         console.log('Navigating to unsubscribe URL with deleted token:', unsubscribeUrl(token));
//         try
//         {
//             await page.goto(unsubscribeUrl(token), { timeout: 10000 });
//         }
//         catch (error)
//         {
//             console.error('Error navigating to unsubscribe URL with deleted token:', error.message);
//             console.log('Retrying navigation...');
//             await page.goto(unsubscribeUrl(token), { timeout: 10000 });
//         }
//         await expect(page.url()).to.equal(baseURL + '/error.html?error=Token+not+found');
//         await expect(await page.textContent('#error-message')).to.equal('Token not found');
//     });
// });
