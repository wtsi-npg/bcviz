define(['src/bamcheck/dotPlot'], function (dotPlot) {
  var keysIS = ["totalPairs", "inwardPairs", "outwardPairs", "otherPairs"];
  return function (data, divID, legend, title, width, height) {
    if (title && data[9]) {
      title = data[9].title;
    }
    if (data && data[1] && data[1][1] && data[1][1].values && data[1][1].values.length !== 0) {
      return new dotPlot(data[1], divID, legend, title, keysIS, width, height);
    } else {
      window.console.log('data does not exist; chart not created.');
      return null;
    }
  };
});