// e2e.spec.js
const { test, expect } = require('@playwright/test');

const baseURL = process.env.BASE_URL || 'http://frontend:4001';

async function waitForService(url, timeout = 20000) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
        try {
            const res = await fetch(url, { method: 'POST' });
            if (res.ok) return;
        } catch (e) {}
        await new Promise(r => setTimeout(r, 1000));
    }
    throw new Error(`Service at ${url} not available after ${timeout}ms`);
}

test.beforeEach(async () => {
    await waitForService('http://subscription:4003/api/test/clear');
});

test.describe('SkyFetch E2E Tests', () => {
    test('should display all input fields and submit button on homepage', async ({ page }) => {
        await page.goto(baseURL);

        // Check URL
        await expect(page).toHaveURL(baseURL + '/');

        // Check email input
        await expect(page.locator('input[name="email"]')).toBeVisible();
        await expect(page.locator('input[name="email"]')).toHaveAttribute('placeholder', 'Your email');

        // Check city input
        await expect(page.locator('input[name="city"]')).toBeVisible();
        await expect(page.locator('input[name="city"]')).toHaveAttribute('placeholder', 'City');

        // Check frequency select
        await expect(page.locator('select[name="frequency"]')).toBeVisible();
        await expect(page.locator('select[name="frequency"] option[value=""]')).toHaveText('Frequency');

        // Check submit button
        await expect(page.locator('button[type="submit"]')).toBeVisible();
        await expect(page.locator('button[type="submit"]')).toHaveText('Subscribe');
    });

    test('should show a confirmation message after subscribing', async ({ page }) => {
        await page.goto(baseURL);

        await page.fill('input[name="email"]', 'test@example.com');
        await page.fill('input[name="city"]', 'Milan');
        await page.selectOption('select[name="frequency"]', 'daily');
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

    test('should reject duplicate subscription and show a message', async ({ page }) => {
        const email = `dupe-${Date.now()}@example.com`;

        await page.goto(baseURL);
        await expect(page).toHaveURL(baseURL + '/');

        // First subscription (should succeed)
        await page.fill('input[name="email"]', email);
        await page.fill('input[name="city"]', 'Paris');
        await page.selectOption('select[name="frequency"]', 'daily');
        await page.click('button[type="submit"]');
        await page.waitForTimeout(3000);

        // Second subscription with the same data (should be duplicate)
        await page.fill('input[name="email"]', email);
        await page.fill('input[name="city"]', 'Paris');
        await page.selectOption('select[name="frequency"]', 'daily');
        await page.click('button[type="submit"]');
        await page.waitForTimeout(5000);

        const message = await page.textContent('#message');
        expect(message).toBe('Subscription already exists for this city and frequency.');
    });
});
//     it('should reject subscription for invalid city and show a message', async () =>
//     {
//         await subscriptionRepo.clear();
//         await page.goto(baseURL);
//         await expect(page.url()).to.equal(baseURL + '/');
//
//         // Fill out the form
//         await page.fill('input[name="email"]', sub.email);
//         await page.fill('input[name="city"]', 'gkhghfgh');
//         await page.selectOption('select[name="frequency"]', sub.frequency);
//         await page.click('button[type="submit"]');
//
//         // Verify no redirect (still on homepage)
//         await expect(page.url()).to.equal(baseURL + '/');
//
//         // Verify success message in #message div
//         await expect(await page.textContent('#message')).to.equal('Validating city...');
//
//         // Wait for success message (up to 3 seconds to account for API delay)
//         await delay(6000);
//
//         await expect(await page.textContent('#message')).to.equal('❌ Invalid city: No weather data available for this location');
//     });
//
//     it('should reject duplicate subscription and show a message', async () =>
//     {
//         await subscriptionRepo.clear();
//         await page.goto(baseURL);
//         await expect(page.url()).to.equal(baseURL + '/');
//
//         await subscriptionService.subscribeUser(sub.email, sub.city, sub.frequency);
//         // Fill out the form
//         await page.fill('input[name="email"]', sub.email);
//         await page.fill('input[name="city"]', sub.city);
//         await page.selectOption('select[name="frequency"]', sub.frequency);
//         await page.click('button[type="submit"]');
//
//         // Verify no redirect (still on homepage)
//         await expect(page.url()).to.equal(baseURL + '/');
//
//         // Verify success message in #message div
//         await expect(await page.textContent('#message')).to.equal('Validating city...');
//
//         // Wait for success message (up to 3 seconds to account for API delay)
//         await delay(5000);
//
//         await expect(await page.textContent('#message')).to.equal('Subscription already exists for this city and frequency.');
//     });
//
//     it('should not allow submission if not all fields are filled', async () =>
//     {
//         await subscriptionRepo.clear();
//         await page.goto(baseURL);
//         await expect(page.url()).to.equal(baseURL + '/');
//
//         await page.click('button[type="submit"]');
//         await expect(page.url()).to.equal(baseURL + '/');
//         await expect(await page.textContent('#message')).to.equal('');
//
//         await page.fill('input[name="email"]', sub.email);
//         await expect(page.url()).to.equal(baseURL + '/');
//         await expect(await page.textContent('#message')).to.equal('');
//
//         await page.selectOption('select[name="frequency"]', sub.frequency);
//         await page.fill('input[name="email"]', '');
//         await expect(page.url()).to.equal(baseURL + '/');
//         await expect(await page.textContent('#message')).to.equal('');
//     });
//
//     it('should not allow submission if email format is invalid', async () =>
//     {
//         await subscriptionRepo.clear();
//         await page.goto(baseURL);
//         await expect(page.url()).to.equal(baseURL + '/');
//
//         await page.fill('input[name="email"]', 'jhkhhj');
//         await page.fill('input[name="city"]', sub.city);
//         await page.selectOption('select[name="frequency"]', sub.frequency);
//         await page.click('button[type="submit"]');
//
//         await expect(page.url()).to.equal(baseURL + '/');
//         await expect(await page.textContent('#message')).to.equal('');
//     });
//
//     // Confirmation page ------------------------------------ \
//     it('should confirm a new subscription with a valid token', async () =>
//     {
//         await subscriptionRepo.clear();
//         const result = await subscriptionService.subscribeUser(sub.email, sub.city, sub.frequency);
//         const token = result.data.token;
//         const url = confirmUrl(token);
//         console.log('Navigating to confirm URL:', url);
//         let redirectDetected = false;
//         page.on('response', response =>
//         {
//             if (response.url().includes('/confirm/') && response.status() === 302)
//             {
//                 console.log('Redirect detected with status 302 for confirm URL');
//                 redirectDetected = true;
//             }
//         });
//         await page.goto(url, { timeout: 10000 });
//         await delay(2000);
//         await expect(redirectDetected).to.equal(true, 'Expected a 302 redirect during confirmation');
//         await expect(page.url()).to.equal(baseURL + `/confirmed.html?city=${sub.city}&frequency=${sub.frequency}&token=${token}`);
//         const headerText = await page.textContent('h1');
//         await expect(headerText).to.include('Your subscription is confirmed!', 'Expected confirmation page header');
//     });
//
//     // Unsubscribed page ------------------------------------ \
//     it('should unsubscribe a user with a valid token', async () =>
//     {
//         await subscriptionRepo.clear();
//         const result = await subscriptionService.subscribeUser(sub.email, sub.city, sub.frequency);
//         const token = result.data.token;
//         await subscriptionService.confirmSubscription(token);
//         const url = `${baseURL}/unsubscribe/${token}`;
//         console.log('Navigating to unsubscribe URL:', url);
//         let redirectDetected = false;
//         page.on('response', response =>
//         {
//             if (response.url().includes('/unsubscribe/') && response.status() === 302)
//             {
//                 console.log('Redirect detected with status 302 for unsubscribe URL');
//                 redirectDetected = true;
//             }
//         });
//         await page.goto(url, { timeout: 10000 });
//         await delay(2000);
//         await expect(redirectDetected).to.equal(true, 'Expected a 302 redirect during unsubscription');
//         await expect(page.url()).to.equal(baseURL + '/unsubscribed.html');
//         const unsubscribeHeaderText = await page.textContent('h1');
//         await expect(unsubscribeHeaderText).to.include('You\'ve successfully unsubscribed!', 'Expected unsubscription page header');
//     });
//
//     // Error page ------------------------------------ \
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
