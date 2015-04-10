define(['d3'], function (d3) {
  return function (divID) {
    if(!isNaN(parseInt(divID, 10)) || !/\S/.test(divID) || d3.select(divID).empty()) {
      return "body";
    }else{
      return divID;
    }
  };
});
