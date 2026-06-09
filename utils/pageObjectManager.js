const { AdminLoginPage } = require('../pages/adminLoginPage');
const { AdminRoomsPage } = require('../pages/adminRoomsPage');
const { AdminReportPage } = require('../pages/adminReportPage');
const { HomePage } = require('../pages/homePage')
const { RoomsPage } = require('../pages/roomsPage');
const { BookingPage } = require('../pages/bookingPage');
const { ContactPage } = require('../pages/contactPage');
const { AdminMessagePage } = require('../pages/adminMessagesPage');

class PageObjectManager {
    constructor(page) {
        this.page = page;
    }

    getHomePage() {
        if (!this.homePage) {
            this.homePage = new HomePage(this.page);
        }
        return this.homePage;
    }

    getAdminLoginPage() {
        if (!this.adminLoginPage) {
            this.adminLoginPage = new AdminLoginPage(this.page);
        }
        return this.adminLoginPage;
    }

    getRoomsPage() {
        if (!this.roomsPage) {
            this.roomsPage = new RoomsPage(this.page);
        }
        return this.roomsPage;
    }

    getBookingPage() {
        if (!this.bookingPage) {
            this.bookingPage = new BookingPage(this.page);
        }
        return this.bookingPage;
    }

    getAdminRoomsPage() {
        if (!this.adminRoomsPage) {
            this.adminRoomsPage = new AdminRoomsPage(this.page);
        }
        return this.adminRoomsPage;
    }

    getAdminReportPage() {
        if (!this.adminReportPage) {
            this.adminReportPage = new AdminReportPage(this.page);
        }
        return this.adminReportPage;
    }

    getContactPage() {
        if (!this.contactPage) {
            this.contactPage = new ContactPage(this.page);
        }
        return this.contactPage;
    }

    getAdminMessagePage() {
        if (!this.adminMessagePage) {
            this.adminMessagePage = new AdminMessagePage(this.page);
        }
        return this.adminMessagePage;
    }
}

module.exports = { PageObjectManager }
