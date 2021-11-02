import elementHelper from "./ElementUtil";
class MetaMask {
  get StartedButton() {
    // Get locator of GetStarted button
    return $("//button[text()='Get Started']");
  }
  get importWalletButton() {
    // Get locator of Import button
    return $("//button[text()='Import wallet']");
  }
  get iAgreeButton() {
    // Get locator of I Agree Button
    return $("//button[text()='I Agree']");
  }
  get inputSecretKey() {
    // Get locator of secret key text box
    return $(
      "//input[@placeholder='Paste Secret Recovery Phrase from clipboard']"
    );
  }
  get inputPassword() {
    // Get locator of password text box
    return $("//input[@id='password']");
  }
  get inputConfirmPassword() {
    // Get locator of confirm button text box
    return $("//input[@id='confirm-password']");
  }
  get TermsAndConditionCheckBox() {
    // Get locator of terms and condition check box
    return $(
      "//span[text()='I have read and agree to the ']/parent::span//preceding-sibling::div"
    );
  }
  get importButton() {
    // Get locator of import button
    return $("//button[text()='Import']");
  }
  get allDoneButton() {
    // Get locator of All Done button
    return $("//button[text()='All Done']");
  }
  get closeButton() {
    // Get locator of close button of pop up
    return $("//button[@title='Close']");
  }
  get networkIcon() {
    // Get locator of network icon
    return $(
      "//div[@class='app-header__contents']/div[2]//div[@class='chip__left-icon']"
    );
  }
  get selectNetwork() {
    // // Get locator of kovan network
    // return $("//span[text()='Kovan Test Network']")
    return $("//span[text()='Kovan Test Network']");
  }
  get nextButton() {
    // Get locator of next button
    return $("//button[text()='Next']");
  }
  get connectButton() {
    // Get locator of connect button
    return $("//button[text()='Connect']");
  }

  //start here
  get IUnderstandCheckbox() {
    return $("//div[2]/div/div[2]/label/span");
  }

  get IUnderstandButton() {
    return $("//button[contains(.,'I Understand')]");
  }

  get engageWallet() {
    return $("//div[2]/button/span");
  }

  get browserWallet() {
    return $("//div[3]/button/div");
  }

  get metamaskWallet() {
    return $("//div/div/div/div[2]/button/div");
  }

  get metamaskNextBtn() {
    return $("//button[contains(text(),'Next')]");
  }

  get metamaskConnectBtn() {
    return $("//button[contains(text(),'Connect')]");
  }

  get configureRSKInMetamaskBtn() {
    return $("//button/span/span[2]");
  }

  get approveMetamaskBtnScrolInView() {
    return $("//button[contains(text(),'Approve')]");
  }

  get approveMetamaskBtn() {
    return $("//button[contains(text(),'Approve')]");
  }

  get switchNetworkBtn() {
    return $("//button[contains(text(),'Switch network')]");
  }

  get tradeTab() {
    //hove over trade tab
    return $("//span/div/span");
  }

  get buySovTab() {
    // click buy SOV tab
    return $("//ul/li/a/div");
  }

  get buySOVBtn() {
    return $("//button[contains(.,'Buy SOV')]");
  }

  get enterAmount() {
    return $("//input");
  }

  get buySOVBtnAfterEntringAmount() {
    return $(".sc-10r9m4e-0");
  }

  get spotBuyBtn() {
    return $(".tw-radio-group__label-content--active");
  }

  get selectPairArrowDown() {
    return $("//div[2]/div/div/div[2]/div/div/div/div/div/div/div");
  }

  get placeBuyBtn() {
    return $("//button[contains(.,'PLACE BUY')]");
  }

  get sendPairArrowDown() {
    return $("//img[@alt='arrow-down']");
  }

  get longBtn(){
    return $(".tw-btn-trade--long")
  }

  get shortBtn(){
    return $(".tw-btn-trade--short")
  }

  get reviewConfirmBtn(){
    return $(".tw-btn-dialog:nth-child(1)")
  }


  get marginTradeTab(){
    return $(".bp3-menu > li:nth-child(4) .bp3-text-overflow-ellipsis" )
  }

  get marginTradeArrowDown(){
    return $(".tw-select-origin" )
  }

  get selectRbtcXusd(){
    return $(".bp3-active" )
  }

  get selectRbtcDoc(){
    return $(".bp3-menu > li:nth-child(2) > a:nth-child(1)" )
  }

  get selectBproXusd(){
    return $(".bp3-menu > li:nth-child(3) > a:nth-child(1)" )
  }

  get selectBproDoc(){
    return $(".bp3-menu > li:nth-child(4) > a:nth-child(1)" )
  }

  get selectSendPair() {
    return $(".bp3-input");
  }

  get navigateToBuySOVPage() {
    return $("//ul/li/a/div");
  }

  get confirmMetamaskBtn() {
    return $("//button[contains(text(),'Confirm')]");
  }

  // spot trade
  get buySpotTab() {
    // click buy SOV tab
    return $("//ul/li[3]/a/div");
  }

  importAccount(metamaskInfo) {
    // Enter the Account information
    elementHelper.enterText(this.inputSecretKey, metamaskInfo.secretKey);
    elementHelper.enterText(this.inputPassword, metamaskInfo.password);
    elementHelper.enterText(this.inputConfirmPassword, metamaskInfo.password);
    elementHelper.click(this.TermsAndConditionCheckBox);
    elementHelper.click(this.importButton);
  }
}
export default new MetaMask();
