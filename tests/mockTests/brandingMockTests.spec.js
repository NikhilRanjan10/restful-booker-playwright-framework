const { expect } = require('@playwright/test');
const { test } = require('../../fixtures/index');

    test("@smoke @regression verify page doesn't load when branding API returns server error",
    async ({ page, pageObjectManager }) => { 
        const roomsPage = pageObjectManager.getRoomsPage();

        await page.route('**/api/branding**', async route => {
            await route.fulfill({
                status: 500,
                contentType: 'application/json',
                body: JSON.stringify({ error: 'Internal Server Error' })
            });
        });

        await page.goto('/');
        await expect(page.getByText("This page couldn’t load")).toBeVisible();
    });



