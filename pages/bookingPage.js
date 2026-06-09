class BookingPage{
    constructor(page){
        this.page = page;
        this.reserveNowButton = page.locator("#doReservation");
        this.firstNameInput = page.getByPlaceholder("Firstname");
        this.lastNameInput = page.getByPlaceholder("Lastname");
        this.emailInput = page.getByPlaceholder("Email");
        this.phoneInput = page.getByPlaceholder("Phone");
        this.confirmReserveNowButton = page.getByRole("button",{name: 'Reserve Now'});
        this.bookingConfirmationText = page.locator("h2.card-title");
        this.bookingConfirmationDates = page.locator("p.text-center ");
        this.fieldAlert = page.locator('.alert-danger li');
    }

    async completeBooking(firstname,lastname,email,phone){
        await this.reserveNowButton.click();
        await this.firstNameInput.fill(firstname);
        await this.lastNameInput.fill(lastname);
        await this.emailInput.fill(email);
        await this.phoneInput.fill(phone);
        await this.confirmReserveNowButton.click();
    }

    getBookingConfirmationText(){
        return this.bookingConfirmationText;
    }

    getBookingConfirmationDates(){
        return this.bookingConfirmationDates;
    }
    
    getFieldAlert(){
        return this.fieldAlert;
    }

}
module.exports = { BookingPage }

