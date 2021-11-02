class ElementUtil{
    click(element){
        element.waitForClickable()
        element.click();
    }

    moveTo(element){
        element.waitForClickable()
        element.moveTo(30,60)();
    }

    enterText(element,value){
        element.waitForDisplayed()
        element.setValue("")
        browser.keys(['\uE009','a'])  
        browser.keys(['\uE05D'])  
        element.setValue(value)
    }
    scrollToElement(element){
        element.scrollIntoView();
    }

}
export default new ElementUtil()