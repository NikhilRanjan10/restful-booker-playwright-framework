const { test, expect } = require('@playwright/test');
const { PageObjectManager } = require('../../utils/pageObjectManager');
const { allure  } = require('allure-playwright');

test.describe('Admin Login Validations', () => {
    let pageObjectManager, homePage, adminLoginPage;

    test.beforeEach(async ({ page }) => {
        await allure.step('Navigate to admin login page', async () => {
            await page.goto('/');
            pageObjectManager = new PageObjectManager(page);
            homePage = pageObjectManager.getHomePage();
            adminLoginPage = pageObjectManager.getAdminLoginPage();
            await homePage.goToAdminSection();
        })

    });

    test('@smoke @regression Validate Admin Login with valid credentials', async ({ page }) => {
        await allure.step('Enter valid credentials', async () => {
            await adminLoginPage.performLogin(process.env.ADMIN_USERNAME,
                process.env.ADMIN_PASSWORD);
        })

        await allure.step('Verify successful login', async () => {
            await expect(page).toHaveURL('/admin/rooms');
        });
    });

    test('@regression Validate Admin Login with invalid credentials', async ({ page }) => {
        await allure.step('Enter invalid credentials', async () => {
            await adminLoginPage.performLogin('asdf', 'asdf');
        });
        await allure.step('Verify alert message is visible', async () => {
            await expect(adminLoginPage.getInvalidCredentialsAlert()).toBeVisible();
        });

    });

});

