class ContactPage{
    constructor(page){
        this.page=page;
        this.nameInput = page.getByLabel('Name');
        this.emailInput = page.getByLabel('Email');
        this.phoneInput = page.getByLabel('Phone');
        this.subjectInput = page.getByLabel('Subject');
        this.descriptionInput = page.locator('#description');
        this.submitButton = page.getByRole('button',{name:'Submit'});
        this.alertMessage = page.locator('.alert-danger p');
        this.successMessage = page.locator('.mb-4');
    }

    async fillForm(name,email,phone,subject,message){
         await this.nameInput.fill(name);
         await this.emailInput.fill(email);
         await this.phoneInput.fill(phone);
         await this.subjectInput.fill(subject);
         await this.descriptionInput.fill(message);
         await this.submitButton.click();
    }

    getErrorMessage(){
        return this.alertMessage;
    }

    async getSuccessMessage(){
        return this.successMessage.filter({hasText:'Thanks for getting in touch '});;
    }
}

module.exports = { ContactPage };