const { test: base } = require('@playwright/test');
const { PageObjectManager } = require('../utils/pageObjectManager');
const { RoomsApiUtils } = require('../api/roomsApiUtils');
const { ApiUtils } = require('../api/apiUtils');
const { BookingApiUtils } = require('../api/bookingApiUtils');
const { MessageApiUtils } = require('../api/messageApiUtils');

const test = base.extend({

    pageObjectManager: async ({ page }, use) => {
        const pageObjectManager = new PageObjectManager(page);
        await use(pageObjectManager);
    },

    bookingApiUtils: async ({ }, use) => {
        const bookingApiUtils = new BookingApiUtils();
        await bookingApiUtils.init();
        await use(bookingApiUtils);
        await bookingApiUtils.deleteCreatedBookings();
        await bookingApiUtils.apiContext.dispose();
    },

    roomsApiUtils: async ({ }, use) => {
        const roomsApiUtils = new RoomsApiUtils();
        await roomsApiUtils.init();
        await use(roomsApiUtils);
        await roomsApiUtils.deleteCreatedRoom();
        await roomsApiUtils.apiContext.dispose();
    },

    messageApiUtils: async ({ }, use) => {
        const messageApiUtils = new MessageApiUtils();
        await messageApiUtils.init();
        await use(messageApiUtils);
        await messageApiUtils.deleteCreatedMessages();
        await messageApiUtils.apiContext.dispose();
    },

    authenticatedPage: async ({ page }, use) => {
        const token = await new ApiUtils().getToken();
        const { hostname } = new URL(process.env.BASE_URL);
        await page.context().addCookies([{
            name: 'token', value: token,
            domain: hostname, path: '/'
        }]);
        await use(page);
    }

})

module.exports = { test };