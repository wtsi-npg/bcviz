define(['src/dotPlot'], function(dotPlot){
    var keysGCC = ["A", "C", "G", "T"];
    return function (data, divID, legend, title, width, height) {
        if(title && data[9]){
          title = data[9].title;
        }
        if(data && data[5] && data[5][1] && data[5][1].values && data[5][1].values.length !== 0){
            return new dotPlot(data[5], divID, legend, title, keysGCC, width, height);
        }else{
            window.console.log('data does not exist; chart not created.');
            return null;
        }
    };
});