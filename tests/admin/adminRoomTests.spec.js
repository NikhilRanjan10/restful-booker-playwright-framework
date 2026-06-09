const { expect } = require('@playwright/test');
const { test } = require('../../fixtures/index');
const twinRoomPayload = require('../../testdata/rooms/twinRoomPayload.json');

test.describe('@smoke @regression Validate Room Creation via API', () => {

    test.beforeEach(async ({ roomsApiUtils }) => {
        await roomsApiUtils.createRoom(twinRoomPayload);
    });

    test('Validate Created Room appears in UI admin panel', async ({ pageObjectManager, authenticatedPage }) => {
        const adminRoomsPage = pageObjectManager.getAdminRoomsPage();
        await authenticatedPage.goto('/admin/rooms');
        await expect(adminRoomsPage.getRoomName(twinRoomPayload.roomName)).toBeVisible();
    });
});

// commented code before the implementation of custom fixtures
// test.describe('Validate Room Creation via API', () => {
//     let token;
//     test.beforeEach(async ({ }) => {
//         const apiUtils = new ApiUtils();
//         token = await apiUtils.getToken();
//         await apiUtils.init();
//         await apiUtils.createRoom(twinRoomPayload);
//     });

//     test.only('Validate Created Room appears in UI admin panel', async ({ page }) => {

//         await page.context().addCookies([{
//             name: 'token', value: token,
//             domain: 'automationintesting.online', path: '/'
//         }]);
//         await page.goto('/admin/rooms');
//         await expect(page.locator('.col-sm-1 p').filter({hasText:twinRoomPayload.roomName})).toBeVisible();

//     })
// })
