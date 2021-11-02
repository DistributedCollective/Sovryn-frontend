import { Given, When, Then } from '@cucumber/cucumber';

// Page Objects

import metaMaskPO from '../pageobjects/MetaMask';
import elementHelper from '../pageobjects/ElementUtil';
import swapPagePO from '../pageobjects/SwapPage';
import homepagePo from '../pageobjects/HomePage';

// Page Data
import metamaskData from '../pagedata/metamaskData';

Given('User setup the metamask plugin', () => {
  browser.switchWindow('data:,');
  browser.closeWindow();
  browser.switchWindow('MetaMask');
  browser.maximizeWindow();
  elementHelper.click(metaMaskPO.StartedButton);
  elementHelper.click(metaMaskPO.importWalletButton);
  browser.pause(2000);
  elementHelper.click(metaMaskPO.iAgreeButton);
  metaMaskPO.importAccount(metamaskData.metaMaskInformation);
  elementHelper.click(metaMaskPO.allDoneButton);
  elementHelper.click(metaMaskPO.closeButton);
  elementHelper.click(metaMaskPO.networkIcon);
  elementHelper.click(metaMaskPO.selectNetwork);

  browser.url('https://test.sovryn.app');
  // browser.switchWindow('MetaMask Notification')
  // elementHelper.click(metaMaskPO.nextButton)
  // elementHelper.click(metaMaskPO.connectButton)
  // browser.switchWindow("https://test.sovryn.app")

  elementHelper.click(metaMaskPO.IUnderstandCheckbox);
  elementHelper.click(metaMaskPO.IUnderstandButton);
  elementHelper.click(metaMaskPO.IUnderstandButton);
  elementHelper.click(metaMaskPO.engageWallet);
  elementHelper.click(metaMaskPO.browserWallet);
  browser.pause(1000);
  elementHelper.click(metaMaskPO.metamaskWallet);
  browser.pause(1000);
  browser.switchWindow('MetaMask Notification');
  elementHelper.click(metaMaskPO.metamaskNextBtn);
  elementHelper.click(metaMaskPO.metamaskConnectBtn);
  browser.pause(1000);
  browser.switchWindow('SOV trading is now live! - Sovryn testnet');
  browser.pause(1000);
  elementHelper.click(metaMaskPO.configureRSKInMetamaskBtn);
  browser.pause(3000);
  browser.switchWindow('MetaMask');
  elementHelper.scrollToElement(metaMaskPO.approveMetamaskBtn);
  elementHelper.click(metaMaskPO.approveMetamaskBtn);
  elementHelper.click(metaMaskPO.switchNetworkBtn);
  browser.pause(2000);
});

When('I navigate to the trade page', () => {
  browser.switchWindow('SOV trading is now live! - Sovryn testnet');
  elementHelper.click(metaMaskPO.tradeTab);
  browser.pause(2000);
});

When('I navigate to the swap page', () => {
  elementHelper.click(swapPagePO.clickSwapTab);
  browser.pause(2000);
});

When('I select my desired pair and enter amount', datatable => {
  datatable.hashes().forEach(element => {
    elementHelper.click(metaMaskPO.sendPairArrowDown);
    browser.pause(2000);
    elementHelper.click(metaMaskPO.selectSendPair);
    browser.pause(1000);
    $('.bp3-input').setValue(element.sendPair);
    browser.pause(1000);
    // $(".bp3-input").keys('Enter');
    $('//a/div/div/div/span/span').click();
    browser.pause(1000);

    //receive dropdown
    $("(//img[@alt='arrow-down'])[2]").click();
    browser.pause(1000);
    $('.bp3-input').setValue(element.receiveedPair);
    // $(".bp3-input").keys('Enter');
    $('.tw-flex-items-center').click();
    browser.pause(1000);
    $('//input').setValue(element.amount);
    browser.pause(3000);
  });
});

When(/^I click the buy Sov button$/, function () {
  elementHelper.click(metaMaskPO.buySOVBtn);
  browser.pause(2000);
});

When('User enter the rBTC amount {string}', amount => {
  elementHelper.enterText(metaMaskPO.enterAmount, amount);
  browser.pause(1000);
});

When('I click the SWAP button', () => {
  elementHelper.click(swapPagePO.SwapBtn);
  browser.pause(1000);
});

When(/^I confirm transaction on metamask button$/, function () {
  browser.switchWindow('MetaMask');
  elementHelper.click(metaMaskPO.confirmMetamaskBtn);
  browser.pause(2000);
});

Then('I should see a success message', () => {
  browser.switchWindow('Margin Trade - Sovryn testnet');
  // browser.pause(2000);
  $('.sc-1tvtnc3-0').click();
  browser.pause(2000);
});

When(/^I navigate to the buy SOV page$/, function () {
  elementHelper.click(metaMaskPO.navigateToBuySOVPage);
  browser.pause(1000);
});

When(
  /^I click the buy Sov button to make finalised transactions$/,
  function () {
    elementHelper.click(metaMaskPO.buySOVBtnAfterEntringAmount);
    browser.pause(1000);
  },
);

// Spot trade starts here

When('I navigate to the Spot page', () => {
  browser.pause(1000);
  elementHelper.click(metaMaskPO.buySpotTab);
  browser.pause(2000);
});

When('I select the BUY button', () => {
  elementHelper.click(metaMaskPO.spotBuyBtn);
  browser.pause(2000);
});

When('I select Pairs from the available dropdown', datatable => {
  datatable.hashes().forEach(element => {
    elementHelper.click(metaMaskPO.selectPairArrowDown);
    browser.pause(1000);
    $('.bp3-input').setValue(element.desiredPairs);
    browser.pause(1000);
    $('.bp3-input').keys('Enter');
    browser.pause(2000);

    $('//div/input').setValue(element.amount);
    browser.pause(1000);
  });
});

When('I click the Place Buy button', () => {
  elementHelper.click(metaMaskPO.placeBuyBtn);
  browser.pause(2000);
});

When('I click the confirm button', () => {
  browser.pause(2000);
  browser.switchWindow('MetaMask');
  elementHelper.click(metaMaskPO.confirmMetamaskBtn);
  browser.pause(10000);
});

Then('I should see a spot success message', () => {
  browser.switchWindow('Spot Trading - Sovryn testnet');
  browser.pause(2000);
  $('.sc-1tvtnc3-0').click();
  browser.pause(7000);
});

//Margin Trade

When(/^I navigate to the Margin trade page$/, function () {
  // browser.pause(2000);
  elementHelper.click(metaMaskPO.marginTradeTab);
  browser.pause(2000);
});
When(/^I select selectRbtcXusd and amount$/, function (datatable) {
  datatable.hashes().forEach(element => {
    browser.pause(1000);
    const parent = metaMaskPO.marginTradeArrowDown
      .parentElement()
      .parentElement();
    elementHelper.click(metaMaskPO.marginTradeArrowDown);
    browser.pause(1000);
    elementHelper.click(metaMaskPO.selectRbtcXusd);
    browser.pause(2000);
    // elementHelper.click(metaMaskPO.selectRbtcDoc);
    // browser.pause(2000);

    // elementHelper.click(metaMaskPO.selectBproXusd);
    // browser.pause(2000);
    // elementHelper.click(metaMaskPO.selectBproDoc);
    // browser.pause(2000);
    $('.tw-input').setValue(element.amount);
    browser.pause(2000);
  });
});

When(/^I select selectRbtcDoc and amount$/, function (datatable) {
  datatable.hashes().forEach(element => {
    browser.pause(1000);
    const parent = metaMaskPO.marginTradeArrowDown
      .parentElement()
      .parentElement();
    elementHelper.click(metaMaskPO.marginTradeArrowDown);
    browser.pause(1000);
    // elementHelper.click(metaMaskPO.selectRbtcXusd);
    // browser.pause(2000);
    elementHelper.click(metaMaskPO.selectRbtcDoc);
    browser.pause(2000);

    // elementHelper.click(metaMaskPO.selectBproXusd);
    // browser.pause(2000);
    // elementHelper.click(metaMaskPO.selectBproDoc);
    // browser.pause(2000);
    $('.tw-input').setValue(element.amount);
    browser.pause(2000);
  });
});

When(/^I select selectBproDoc and amount$/, function (datatable) {
  datatable.hashes().forEach(element => {
    browser.pause(1000);
    const parent = metaMaskPO.marginTradeArrowDown
      .parentElement()
      .parentElement();
    elementHelper.click(metaMaskPO.marginTradeArrowDown);
    browser.pause(1000);
    // elementHelper.click(metaMaskPO.selectRbtcXusd);
    // browser.pause(2000);
    // elementHelper.click(metaMaskPO.selectRbtcDoc);
    // browser.pause(2000);

    // elementHelper.click(metaMaskPO.selectBproXusd);
    // browser.pause(2000);
    elementHelper.click(metaMaskPO.selectBproDoc);
    browser.pause(2000);
    $('.tw-input').setValue(element.amount);
    browser.pause(2000);
  });
});

When(/^I select selectBproXusd and amount$/, function (datatable) {
  datatable.hashes().forEach(element => {
    browser.pause(1000);
    const parent = metaMaskPO.marginTradeArrowDown
      .parentElement()
      .parentElement();
    elementHelper.click(metaMaskPO.marginTradeArrowDown);
    browser.pause(1000);
    // elementHelper.click(metaMaskPO.selectRbtcXusd);
    // browser.pause(2000);
    // elementHelper.click(metaMaskPO.selectRbtcDoc);
    // browser.pause(2000);

    elementHelper.click(metaMaskPO.selectBproXusd);
    browser.pause(2000);
    // elementHelper.click(metaMaskPO.selectBproDoc);
    // browser.pause(2000);
    $('.tw-input').setValue(element.amount);
    browser.pause(2000);
  });
});

When('I click on the Long button', () => {
  elementHelper.click(metaMaskPO.longBtn);
  browser.pause(1000);
});

When('I click on the Short button', () => {
  elementHelper.click(metaMaskPO.shortBtn);
  browser.pause(1000);
});

When('I click the review transaction confirm button', () => {
  elementHelper.click(metaMaskPO.reviewConfirmBtn);
  browser.pause(2000);
});

// When("I click the buy Sov button", () => {
//   elementHelper.click(metaMaskPO.buySOVBtnAfterEntringAmount);
//   browser.pause(1000);
// });
//
// When("I click the confirm button", () => {
//   browser.switchWindow("MetaMask");
//   elementHelper.click(metaMaskPO.confirmMetamaskBtn);
//   browser.pause(10000);
// });

// buy SOV ends here

// When('User enter the stake amount {string}', amount => {
//     elementHelper.enterText(homepagePo.inputStakeAmount, amount)

// })
// When('User select stake length {string}', Month => {
//     homepagePo.selectStakeLength(Month)
// })

// When('User click on start state button and confirm the payment', () => {

//     let element = (homepagePo.authorizedButton).isDisplayed()
//     if (element) {
//         browser.pause(5000)
//         elementHelper.scrollToElement(homepagePo.authorizedButton)
// elementHelper.click(homepagePo.authorizedButton)
//         browser.pause(3000)
//         browser.switchWindow('MetaMask Notification')
//         elementHelper.click(homepagePo.confirmButton)
//         // browser.switchWindow("https://platform.staging.coinburp.ninja/defi/burp")
//         browser.switchWindow("https://test.sovryn.app")
//         browser.pause(10000)
//     }
//     browser.pause(5000)
//     elementHelper.scrollToElement(homepagePo.startStakeButton)
//     elementHelper.click(homepagePo.startStakeButton)
//     browser.pause(3000)
//     browser.switchWindow('MetaMask Notification')
//     elementHelper.click(homepagePo.confirmButton)
//     browser.pause(5000)
//     browser.switchWindow("https://platform.staging.coinburp.ninja/burp/stake")
//     browser.pause(10000)

// })
// Then('User can displayed the stake {string}', amount => {
//     homepagePo.verifyTransactionAmount(amount)
//     browser.pause(3000)

// })
