const { expect } = require("@playwright/test");
const { ApiUtils } = require("./apiUtils");

class BookingApiUtils extends ApiUtils{
    constructor(){
        super();
        this.createdBookingIds = [];
    }

    async createBooking(bookingPayload){
        const response = await this.apiContext.post('/api/booking',
            {data: bookingPayload}
        );
        expect(await response.status()).toBe(201);
        const bookingId = (await response.json()).bookingid;
        this.createdBookingIds.push(bookingId);
        return bookingId;
    }

    async deleteBooking(bookingId){
        const response = await this.apiContext.delete(`/api/booking/${bookingId}`);
        expect(await response.status()).toBe(202);
    }

    async deleteCreatedBookings() {
    for (const bookingId of this.createdBookingIds) {
        await this.deleteBooking(bookingId);
        }
    this.createdBookingIds = [];
    }
}

module.exports = { BookingApiUtils };