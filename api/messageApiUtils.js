const { expect } = require('@playwright/test');
const { ApiUtils } = require('./apiUtils');

class MessageApiUtils extends ApiUtils{

    constructor(){
        super();
        this.createdMessageIds = [];
    }

    async getMessages(){
        const response = await this.apiContext.get('/api/message');
        expect(response.status()).toBe(200);
        return (await response.json()).messages;
    };

    async getMessageId(subject) {
        const messages = await this.getMessages();
        const message = messages.find(m => m.subject === subject);
        if (!message) throw new Error(`Message with subject "${subject}" not found`);
        return message.id;
    };

    async deleteMessage(messageId) {
        const response = await this.apiContext.delete(`/api/message/${messageId}`);
        expect(response.status()).toBe(202);
    };

    async deleteCreatedMessages() {
        for (const messageId of this.createdMessageIds) {
            await this.deleteMessage(messageId);
        }
        this.createdMessageIds = [];
    };
}

module.exports = { MessageApiUtils } 