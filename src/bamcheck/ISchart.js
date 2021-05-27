/* globals define */

'use strict';

define(['src/bamcheck/dotPlot'], function(dotPlot) {
  var drawChart = function(config) {
    var results = {};
    var data = config.data;
    var width = config.width || 350;
    var height = config.height || 250;
    var title = config.title || 'IS Chart';
    var keys = ["totalPairs", "inwardPairs", "outwardPairs", "otherPairs"];
    if (data && data.size && data.size.length !== 0) {
      var points = [];
      points.push(makePoints(data.size, data.total));
      points.push(makePoints(data.size, data.inwards));
      points.push(makePoints(data.size, data.outwards));
      points.push(makePoints(data.size, data.other));
      results =  dotPlot(points, 'Insert Size', 'Pairs',  1, title, keys, width, height);
    } else {
      results = { svg: null, legend: null };
    }
    return results;
  };

  function makePoints(a1, a2) {
    var points = [];
    for (var n = 0; n < a1.length; n++) {
      points.push({ xVar: a1[n], yVar: a2[n] });
    }
    return points;
  }

  return {
    drawChart: drawChart,
  };

});
