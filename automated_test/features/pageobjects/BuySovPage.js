class BuySovPage{

    get inputStakeAmount() {
        // Get locator of stake amount text box
        return $("//input")
    }

    get mouseOverTradeTab(){
     return $("//span/div/span")
   
    }

    get buySovTab(){
       return $("//ul/li/a/div")
  browser.pause(1000)
    }
}

export default new BuySovPage()