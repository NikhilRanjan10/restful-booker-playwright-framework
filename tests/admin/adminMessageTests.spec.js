const { expect } = require('@playwright/test');
const { test } = require('../../fixtures/index');
const data = require('../../testdata/contact/validContactFormData.json');
const { AdminMessagePage } = require('../../pages/adminMessagesPage');

test('@regression Verify message create by user on UI appears on admin message dashboard', async ({ pageObjectManager, messageApiUtils, page, browser }) => {
    const contactPage = pageObjectManager.getContactPage();
    const homePage = pageObjectManager.getHomePage();
        
    await page.goto('/');
    await homePage.goToContactSection();
    await contactPage.fillForm(data.name,data.email,data.phone,data.subject,data.message);
    await expect(contactPage.getSuccessMessage()).toBeVisible();
    const messageId = await messageApiUtils.getMessageId(data.subject);
    messageApiUtils.createdMessageIds.push(messageId);
    const adminContext = await browser.newContext({
        storageState: 'auth/adminState.json'
    });
    const adminPage = await adminContext.newPage();
    await adminPage.goto('/admin/message');
    const adminMessagePage = new AdminMessagePage(adminPage);
    await adminMessagePage.clickMessageBySubject(data.subject);
    await expect(adminMessagePage.getMessageSubject(data.subject)).toBeVisible();
    await expect(adminMessagePage.getMessageDescription(data.message)).toBeVisible();
    await adminContext.close();

});
