const expect = require('@playwright/test');
class AdminLoginPage {
    constructor(page){
        this.page = page;
        this.username = page.getByLabel("Username");
        this.password = page.getByPlaceholder("Password");
        this.loginButton = page.locator("#doLogin");
        this.frontPageLink = page.getByRole('link',{name: 'Front Page'});
        this.logoutLink = page.locator('.btn').filter({hasText:'Logout'});
        this.invalidCredentialsAlert = page.getByText("Invalid credentials");
    }

    async performLogin(username,password){
        await this.username.fill(username);
        await this.password.fill(password);
        await this.loginButton.click();
    }

    getInvalidCredentialsAlert(){
        return this.invalidCredentialsAlert;
    }
}

module.exports = {AdminLoginPage}