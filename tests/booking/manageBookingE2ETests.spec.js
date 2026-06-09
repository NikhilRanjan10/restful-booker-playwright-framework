const { test, expect } = require('@playwright/test');
const { PageObjectManager } = require('../../utils/pageObjectManager');
const { formatDateToYYYYMMDD } = require('../../utils/dateUtils');

test.describe('Booking Validations', () => {
    let pageObjectManager, homePage, roomsPage, bookingPage;
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        pageObjectManager = new PageObjectManager(page);
        homePage = pageObjectManager.getHomePage();
        roomsPage = pageObjectManager.getRoomsPage();
        bookingPage = pageObjectManager.getBookingPage();
    });

    async function navigateAndCheckAvailability(page, checkInDate, checkOutDate) {
        await homePage.goToBookingSection();
        await expect(page).toHaveURL('/#booking');
        await roomsPage.checkAvailability(checkInDate, checkOutDate);
        await homePage.goToRoomsSection();
        await expect(page).toHaveURL('/#rooms');
    }

    async function verifyAndCompleteBooking(page, checkInDate, checkOutDate,firstname,lastname,email,phone) {
        const formattedCheckIn = formatDateToYYYYMMDD(checkInDate);
        const formattedCheckOut = formatDateToYYYYMMDD(checkOutDate);
        const reservationUrl = new RegExp(`/reservation/\\d+\\?checkin=${formattedCheckIn}&checkout=${formattedCheckOut}`);
        await expect(page).toHaveURL(reservationUrl);
        await bookingPage.completeBooking(firstname,lastname,email,phone);
        await expect(bookingPage.getBookingConfirmationText()).toHaveText("Booking Confirmed");
        await expect(bookingPage.getBookingConfirmationDates()).toHaveText(`${formattedCheckIn} - ${formattedCheckOut}`);
    }

    test.describe('Valid Bookings', ()=>{
        
        for (const roomType of ['Single', 'Double', 'Suite']) {
            test(`@regression Validate Booking Flow For ${roomType} Room Type`, async ({ page }) => {
            const checkInDate = '18 June 2026';
            const checkOutDate = '20 June 2026';
            await navigateAndCheckAvailability(page, checkInDate, checkOutDate);
            await roomsPage.selectRoom(roomType);
            await verifyAndCompleteBooking(page, checkInDate, checkOutDate,"Nikhil", "Ranjan", "Nikhil.Ranjan@email.com", "123456789012");
            });
        }

        test('@regression Validate Booking Flow For Random Room Type', async ({ page }) => {
        const checkInDate = '28 July 2026';
        const checkOutDate = '30 July 2026';
        await navigateAndCheckAvailability(page, checkInDate, checkOutDate);

        const rooms = ['Single', 'Double', 'Suite'];
        const shuffled = [...rooms].sort(() => Math.random() - 0.5);
        let roomBooked = false;
        for (const room of shuffled) {
            try {
                await roomsPage.selectRoom(room);
                roomBooked = true;
                console.log(`${room} room selected`);
                break;
            } catch (error) {
                if (!error.message.includes('not found on page')) throw error;
                console.log(`${room} not available, trying next room...`);
            }
        }
        if (!roomBooked) throw new Error('No rooms available for the selected dates');
        await verifyAndCompleteBooking(page, checkInDate, checkOutDate,"Nikhil", "Ranjan", "Nikhil.Ranjan@email.com", "123456789012");
        });
    });

    test.describe('Registration Form Validations', () =>{
        test('Validate error message for missing first name on reservation page',async({page})=>{
            await roomsPage.selectRoom('Single');
            await bookingPage.completeBooking("", "Ranjan", "Nikhil.Ranjan@email.com", "123456789012");
            await bookingPage.getFieldAlert().last().waitFor({ state: 'visible' });
            expect(await bookingPage.getFieldAlert().allTextContents()).toEqual(expect.arrayContaining(['Firstname should not be blank', 'size must be between 3 and 18']));
        });

        test('Validate error message for first name having less than 3 characters on reservation page',async({page})=>{
            await roomsPage.selectRoom('Single');
            await bookingPage.completeBooking("Ni", "Ranjan", "Nikhil.Ranjan@email.com", "123456789012");
            await bookingPage.getFieldAlert().first().waitFor({ state: 'visible' });
            expect(await bookingPage.getFieldAlert()).toContainText('size must be between 3 and 18');
        });

        test('Validate error message for missing last name on reservation page',async({page})=>{
            await roomsPage.selectRoom('Single');
            await bookingPage.completeBooking("Nikhil", "", "Nikhil.Ranjan@email.com", "123456789012");
            await bookingPage.getFieldAlert().last().waitFor({ state: 'visible' });
            expect(await bookingPage.getFieldAlert().allTextContents()).toEqual(expect.arrayContaining(['Lastname should not be blank', 'size must be between 3 and 30']));
        });

        test('Validate error message for last name having less than 3 characters on reservation page',async({page})=>{
            await roomsPage.selectRoom('Single');
            await bookingPage.completeBooking("Nikhil", "Ra", "Nikhil.Ranjan@email.com", "123456789012");
            await bookingPage.getFieldAlert().first().waitFor({ state: 'visible' });
            expect(await bookingPage.getFieldAlert()).toContainText('size must be between 3 and 30');
        });

        test('Validate error message for missing email on reservation page',async({page})=>{
            await roomsPage.selectRoom('Single');
            await bookingPage.completeBooking("Nikhil", "Ranjan", "", "123456789012");
            await bookingPage.getFieldAlert().first().waitFor({ state: 'visible' });
            expect(await bookingPage.getFieldAlert()).toContainText("must not be empty");
        });

        test('Validate error message for invalid email format (without @) on reservation page',async({page})=>{
            await roomsPage.selectRoom('Single');
            await bookingPage.completeBooking("Nikhil", "Ranjan", "nikhil.com", "123456789012");
            await bookingPage.getFieldAlert().first().waitFor({ state: 'visible' });
            expect(await bookingPage.getFieldAlert()).toContainText("must be a well-formed email address");
        });

        test('Validate error message for missing phone on reservation page',async({page})=>{
            await roomsPage.selectRoom('Single');
            await bookingPage.completeBooking("Nikhil", "Ranjan", "Nikhil.Ranjan@email.com", "");
            await bookingPage.getFieldAlert().last().waitFor({ state: 'visible' });
            expect(await bookingPage.getFieldAlert().allTextContents()).toEqual(expect.arrayContaining(['must not be empty', 'size must be between 11 and 21']));
        });

        test('Validate error message for phone having less than 11 digits on reservation page',async({page})=>{
            await roomsPage.selectRoom('Single');
            await bookingPage.completeBooking("Nikhil", "Ranjan", "Nikhil.Ranjan@email.com", "134567");
            await bookingPage.getFieldAlert().first().waitFor({ state: 'visible' });
            expect(await bookingPage.getFieldAlert()).toContainText('size must be between 11 and 21');
        });
    })
});
