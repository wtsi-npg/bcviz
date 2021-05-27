/* globals define */

'use strict';

define(['src/bamcheck/dotPlot'], function(dotPlot) {
  var drawChart = function(config) {
    var results = {};
    var data = config.data;
    var width = config.width || 350;
    var height = config.height || 250;
    var title = config.title || 'gccChart';

    if (data && data.cycle && data.cycle.length !== 0) {
      var points = [];
      points.push(makePoints(data.cycle, data.base_A));
      points.push(makePoints(data.cycle, data.base_C));
      points.push(makePoints(data.cycle, data.base_G));
      points.push(makePoints(data.cycle, data.base_T));
      results = dotPlot(points, 'Read Cycle', 'Base Content %', 1, title, ["A", "C", "G", "T"], width, height);
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
