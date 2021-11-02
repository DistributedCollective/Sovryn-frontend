import { Given, When, Then } from "@cucumber/cucumber";

// Page Objects

import metaMaskPO from "../pageobjects/MetaMask";
import elementHelper from "../pageobjects/ElementUtil";
import homepagePo from "../pageobjects/HomePage";
import buySovPage from "../pageobjects/BuySovPage"

// Page Data
import metamaskData from "../pagedata/metamaskData";

When("I click on the trade tabs", () => {
    browser.switchWindow("SOV trading is now live! - Sovryn testnet");
    elementHelper.click(metaMaskPO.tradeTab);
    browser.pause(2000);
    elementHelper.click(metaMaskPO.buySovTab);
    elementHelper.click(metaMaskPO.buySOVBtn);
    browser.pause(1000);
});

When("User enter the SOV amount {string}", (amount) => {
    elementHelper.enterText(metaMaskPO.enterAmount, amount);
    browser.pause(1000);
});

// When("I click the buy Sov button", () => {
//     elementHelper.click(metaMaskPO.buySOVBtnAfterEntringAmount);
//     browser.pause(1000);
// });

// When("I click the confirm the metamask button", () => {
//     browser.switchWindow("MetaMask");
//     elementHelper.click(metaMaskPO.confirmMetamaskBtn);
//     browser.pause(10000);
// });