const { chromium } = require('@playwright/test');
require('dotenv').config();

async function globalSetup() {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(process.env.BASE_URL + '/admin');
    await page.getByLabel('Username').fill(process.env.ADMIN_USERNAME);
    await page.getByPlaceholder('Password').fill(process.env.ADMIN_PASSWORD);
    await page.locator('#doLogin').click();
    await page.waitForURL('**/admin/rooms');
    await context.storageState({ path: 'auth/adminState.json' });
    await browser.close();
}
module.exports = globalSetup;
