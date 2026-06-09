class AdminMessagePage {
    constructor(page) {
        this.page = page;
        this.messageRow = page.locator('.messages .col-sm-9');
        this.messageDetail = page.locator('[data-testid="message"]');
    }

    async clickMessageBySubject(subject) {
        await this.messageRow.last().waitFor({ state: 'visible' });
        await this.messageRow.filter({ hasText: subject }).click();
    }

    getMessageSubject(subject) {
        return this.messageDetail.locator('p span').filter({ hasText: subject });
    }

    getMessageDescription(description) {
        return this.messageDetail.locator('p').filter({ hasText: description });
    }
}

module.exports = { AdminMessagePage };