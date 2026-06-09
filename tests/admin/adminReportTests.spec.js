const { expect } = require('@playwright/test');
const { test } = require('../../fixtures/index');
const familyRoomPayload = require('../../testdata/rooms/familyRoomPayload.json');
const bookingPayload = require('../../testdata/booking/bookingPayload.json');
const { formatDateToMonthYear } = require('../../utils/dateUtils');

test.describe('@regression Create a room and booking for it through API and verify in UI admin report that booking exists', () => {

    test.beforeEach(async ({ roomsApiUtils, bookingApiUtils }) => {
        await roomsApiUtils.createRoom(familyRoomPayload);
        const roomId = await roomsApiUtils.getRoomId(familyRoomPayload);
        const booking = { ...bookingPayload, roomid: roomId };
        await bookingApiUtils.createBooking(booking);
    });

    test('Verify through UI in admin report section that booking got created', async ({ pageObjectManager, authenticatedPage }) => {

        const adminReportPage = pageObjectManager.getAdminReportPage();
        await authenticatedPage.goto('/admin/report');
        const monthYear = formatDateToMonthYear(bookingPayload.bookingdates.checkin);
        await adminReportPage.getToMonth(monthYear);
        const bookingName = bookingPayload.firstname + " " + bookingPayload.lastname;
        const roomName = familyRoomPayload.roomName;
        await expect(await adminReportPage.getBookingEvent(bookingName, roomName))
            .toBeVisible();

    });
})