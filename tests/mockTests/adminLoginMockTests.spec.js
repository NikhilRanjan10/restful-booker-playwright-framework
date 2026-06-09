const { expect } = require('@playwright/test');
const { test } = require('../../fixtures/index');

test('@smoke @regression verify invalid credentials error displayed when auth API is unavailable', async({ pageObjectManager, page })=>{
    const adminLoginPage = pageObjectManager.getAdminLoginPage();
    await page.route('**/api/auth/login**', async route =>{
        await route.abort();
    });

    await page.goto('/admin/');
    await adminLoginPage.performLogin(process.env.ADMIN_USERNAME,
            process.env.ADMIN_PASSWORD);
    await expect(adminLoginPage.getInvalidCredentialsAlert()).toBeVisible();
})