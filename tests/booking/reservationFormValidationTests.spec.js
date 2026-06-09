const { expect } = require('@playwright/test');
const { test } = require('../../fixtures/index');
const reservationFormData = require('../../testdata/booking/reservationFormValidationData.json')

for (const data of reservationFormData) {
    test(`@regression Reservation Form Validation: ${data.scenario}`, async ({ pageObjectManager, page }) => {
        await page.goto('/');
        const roomsPage = pageObjectManager.getRoomsPage();
        const bookingPage = pageObjectManager.getBookingPage(); 
        await roomsPage.selectRoom('Single');
        await bookingPage.completeBooking(data.firstname,data.lastname,data.email,data.phone);
        await bookingPage.getFieldAlert().last().waitFor({state:'visible'});
        expect(await bookingPage.getFieldAlert().allTextContents()).toEqual(expect.arrayContaining(data.errors));
    })
}
