define(['src/dotPlot'], function(dotPlot){
    var keysGC = ["First_Fragments", "Last_Fragments"];
    return function (data, divID, legend, title, width, height) {
        if(title && data[9]){
          title = data[9].title;
        }
        if(data && data[4] && data[4][1] && data[4][1].values && data[4][1].values.length !== 0){
            return new dotPlot(data[4], divID, legend, title, keysGC, width, height);
        }else{
          window.console.log('data does not exist; chart not created.');
          return null;
        }
    };
});