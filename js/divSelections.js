function checkDivSelection (divID) {
    if(!isNaN(parseInt(divID)) || !/\S/.test(divID) || d3.select(divID).empty()) {
        return "body";
    }else{
        return divID;
    }
}