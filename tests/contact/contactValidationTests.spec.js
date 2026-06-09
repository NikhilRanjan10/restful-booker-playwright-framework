const { expect } = require('@playwright/test');
const { test } = require('../../fixtures/index');

const validationData = require('../../testdata/contact/contactValidationData.json');

for (const data of validationData){
    test(`@regression Contact Form Validation: ${data.scenario}`, async({ pageObjectManager, page })=>{
        await page.goto('/');
        const homePage = pageObjectManager.getHomePage();
        await homePage.goToContactSection();
        const contactPage = pageObjectManager.getContactPage();
        await contactPage.fillForm(data.name,data.email,data.phone,data.subject,data.message);
        await contactPage.getErrorMessage().first().waitFor({state: 'visible'});
        expect(await contactPage.getErrorMessage().allTextContents()).toEqual(expect.arrayContaining(data.errors))
    
    })
}