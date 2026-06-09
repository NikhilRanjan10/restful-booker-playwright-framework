const { formatDateToMMYYYY } = require('../utils/dateUtils');
class AdminReportPage {
    constructor(page) {
        this.page = page;
        this.calendarContainer = page.locator('.rbc-calendar');
        this.monthLabel = page.locator('.rbc-toolbar-label');
        this.bookingEvents = page.locator('.rbc-event-content');
        this.nextMonthButton = page.getByRole("button", { name: 'Next' });
        this.previousMonthButton = page.getByRole("button", { name: 'Back' });
    }

    async navigateToReport() {
        await this.page.goto('/admin/report');
    }

    async getBookingEvent(guestName, roomNumber) {
        return this.bookingEvents.filter({ hasText: `${guestName} - Room: ${roomNumber}` });
    }

    async getToMonth(targetMonthYear) {
        let currentMonthYear = await this.monthLabel.innerText();

        while (currentMonthYear !== targetMonthYear) {
            const current = formatDateToMMYYYY(currentMonthYear);
            const target = formatDateToMMYYYY(targetMonthYear);

            if (target > current) {
                await this.nextMonthButton.click();
            } else {
                await this.previousMonthButton.click();
            }
            currentMonthYear = await this.monthLabel.innerText(); // re-read after click
        }
    }
}

module.exports = { AdminReportPage };