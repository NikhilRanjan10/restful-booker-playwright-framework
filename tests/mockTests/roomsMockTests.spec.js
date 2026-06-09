const { expect } = require('@playwright/test');
const { test } = require('../../fixtures/index');

test('@smoke @regression verify no rooms displayed when rooms API returns empty array', async ({ page, pageObjectManager }) => {
    const roomsPage = pageObjectManager.getRoomsPage();
    await page.route('**/api/room**', async route => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ rooms: [] })
        });
    });
    await page.goto('/');
    await expect(roomsPage.getRoomsLocator()).toHaveCount(0);
});

test('@smoke Verify single room does not appear on UI by altering rooms API call', async ({ page, pageObjectManager }) => {
    const roomsPage = pageObjectManager.getRoomsPage();
    await page.route('**/api/room**', async route => {
        const realResponse = await route.fetch();
        let body = await realResponse.json();

        body.rooms.splice(0, 1);
        await route.fulfill({
            response: realResponse,
            body: JSON.stringify(body)
        });
    });
    await page.goto('/');
    await roomsPage.getRoomsLocator().last().waitFor({ state: 'visible' });
    await expect(roomsPage.getRoomsLocator()).toHaveCount(2);
    await expect(page.getByText('Single')).not.toBeVisible();
})