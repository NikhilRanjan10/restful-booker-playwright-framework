const { ApiUtils } = require("./apiUtils");
const { expect } = require('@playwright/test');

class RoomsApiUtils extends ApiUtils{

    constructor(){
        super();
        this.createdRoomIds = [];
    }

    async createRoom(roomPayload) {
        const response = await this.apiContext.post('/api/room/', { data: roomPayload });
        expect(response.status()).toBe(200);
        const roomId = await this.getRoomId(roomPayload);
        this.createdRoomIds.push(roomId);
    }

    async getRoomId(roomPayload){
        let response = await this.apiContext.get('/api/room');
        expect(response.status()).toBe(200);
        const roomsArray = (await response.json()).rooms;
        for(const room of roomsArray){
            if (room.roomName===roomPayload.roomName){
                return room.roomid;
            }
        }
        throw new Error(`Room with name "${roomPayload.roomName}" not found after creation`);
    }

    async deleteRoom(roomId){
        const response = await this.apiContext.delete(`/api/room/${roomId}`);
        expect(response.status()).toBe(202);
    }

    async deleteCreatedRoom(){
        for (const roomId of this.createdRoomIds){
            await this.deleteRoom(roomId);
        }
        this.createdRoomIds=[];
    }
}

module.exports = { RoomsApiUtils }