class HomePage{

    get inputStakeAmount() {
        // Get locator of stake amount text box
        return $("//input")
    }
    selectStakeLength(Month) {
        // Select stake length
        $("//h5[text()='Stake length in months']/parent::div//following-sibling::div//button//span[text()='" + Month + "']").click()
    }
    get startStakeButton() {
        // Get locator of start stake button
        return $("//span[normalize-space()='Start Stake']")
    }
    get confirmButton() {
        // Get locator of confirm button
        return $("//button[text()='Confirm']")
    }
    get authorizedButton() {
        // Get locator of Authorized button
        return $("//span[text()='Authorise BURP']")
    }
    get disclaimerButtonTerms(){
        // Get locator of disclaimer Terms button
        return $("//input[@name='checkedA']")
    }
    get disclaimerButtonResident(){
        // Get locator of disclaimer Resident Tick button
        return $("//input[@name='checkedB']")
    }
    get disclaimerButtonSubmit(){
        // Get locator of disclaimer Submit button
        return $("//span[contains(text(),'Submit')]")
    }
    verifyTransactionAmount(amount) {
        // Verify Transaction completed
        $("//h4[normalize-space()='$BURP " + amount + ".00']").scrollIntoView();
        $("//h4[normalize-space()='$BURP " + amount + ".00']").isDisplayed()
        browser.pause(5000)
        browser.refresh();
        browser.pause(3000)

        // Verify Earning Circle is displayed

        $("//h4[text()='$BURP " + amount + ".00']//parent::div/parent::div/parent::div/parent::div/parent::div/preceding-sibling::div/*").scrollIntoView();
        $("//h4[text()='$BURP " + amount + ".00']//parent::div/parent::div/parent::div/parent::div/parent::div/preceding-sibling::div/*").isDisplayed();

    }
}
export default new HomePage()