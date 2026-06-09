const { expect, request } = require('@playwright/test');

class ApiUtils {

    async getToken() {
        const baseContext = await request.newContext({ baseURL: process.env.BASE_URL });
        const response = await baseContext.post('/api/auth/login', {
            data: {
                username: process.env.ADMIN_USERNAME,
                password: process.env.ADMIN_PASSWORD
            }
        });
        expect(response.status()).toBe(200);
        const token = (await response.json()).token;
        await baseContext.dispose();
        return token;
    }

    async init() {
        this.token = await this.getToken();
        const { hostname } = new URL(process.env.BASE_URL);

        this.apiContext = await request.newContext({
            baseURL: process.env.BASE_URL,
            storageState: {
                cookies: [{
                    name: 'token',
                    value: this.token,
                    domain: hostname,
                    path: '/',
                    httpOnly: false,
                    secure: false,
                    sameSite: 'Lax',
                    expires: -1
                }],
                origins: []
            }
        });
    }

    
}

module.exports = { ApiUtils };
