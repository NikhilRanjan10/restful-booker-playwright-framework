class AdminRoomsPage{
    constructor(page){
        this.page=page;
        this.roomsName = page.locator('.col-sm-1 p');
    }

    getRoomName(roomName){
        return this.roomsName.filter({hasText:roomName});
    }
}
module.exports = { AdminRoomsPage }