class RoomsPage{
    constructor(page){
        this.page = page;
        this.rooms = page.locator(".col-lg-4");
        this.checkInInput = page.locator('.react-datepicker__input-container').first();
        this.checkOutInput = page.locator('.react-datepicker__input-container').last();
        this.datePickerMonthAndYear = page.locator('.react-datepicker__current-month');
        this.nextMonth = page.locator(".react-datepicker__navigation--next");
        this.date = page.locator(".react-datepicker__month div[role='gridcell']");
        this.availabilityButton = page.getByRole('button',{name:'Check Availability'});
    }

    async checkAvailability(checkInDate,checkOutDate){
        await this.selectDate(this.checkInInput,checkInDate);
        await this.selectDate(this.checkOutInput,checkOutDate);
        await this.availabilityButton.click();
    }

    async selectDate(locator, desiredDate){
        await locator.click();
        const [date, month, year] = desiredDate.split(" ");

        let pageMonthAndYear = await this.datePickerMonthAndYear.textContent();
        while(pageMonthAndYear.trim() !== `${month} ${year}`){
            await this.nextMonth.click();
            pageMonthAndYear = await this.datePickerMonthAndYear.textContent();
        }

        await this.date
            .filter({ hasText: date })
            .and(this.page.locator(`[aria-label*="${month}"]`))
            .click();
    }

    async selectRoom(roomType) {
        await this.rooms.first().waitFor({ state: 'visible' });

        
        const room = this.rooms.filter({ has: this.page.locator('h5', { hasText: roomType }) });
        if (await room.count() === 0) throw new Error(`Room type "${roomType}" not found on page`);
        await room.locator('a').click();

        // previous loop-based approach 
        // const roomCount = await this.rooms.count();
        // for (let i = 0; i < roomCount; i++) {
        //     const type = await this.rooms.nth(i).locator('h5').textContent();
        //     if (type.trim() === roomType) {
        //         await this.rooms.nth(i).locator('a').click();
        //         return;
        //     }
        // }
        // throw new Error(`Room type "${roomType}" not found on page`);
    }

    getRoomsLocator(){
        return this.rooms;
    }
}

module.exports = { RoomsPage }
