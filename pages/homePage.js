class HomePage{
    constructor(page){
        this.page = page;
        this.roomsLink = page.locator("li [href='/#rooms']");
        this.bookingLink = page.locator('li [href="/#booking"]');
        this.locationLink = page.locator('li [href="/#location"]');
        this.contactLink = page.locator('li [href="/#contact"]');
        this.adminLink = page.locator('li [href="/admin"]');
    }

    async goToBookingSection(){
        await this.bookingLink.click();
    }

    async goToRoomsSection(){
        await this.roomsLink.click();
    }
    async goToLocationSection(){
        await this.locationLink.click();
    }
    async goToContactSection(){
        await this.contactLink.click();
    }
    async goToAdminSection(){
        await this.adminLink.click();
    }
}

module.exports = { HomePage }