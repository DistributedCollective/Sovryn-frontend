import elementHelper from './ElementUtil'

class SwapPage{
get clickSwapTab(){
    return $(".bp3-menu > li:nth-child(2) .bp3-text-overflow-ellipsis")
}

    get sendPairArrowDown(){
        return $("//img[@alt='arrow-down']")
    }

get SwapBtn(){
    return $(".sc-10r9m4e-0")
}


}

export default new SwapPage()