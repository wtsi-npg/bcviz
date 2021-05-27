/* globals define */

'use strict';

define(['src/bamcheck/dotPlot'], function(dotPlot) {

  var drawChart = function(config) {
    var results = {};
    var data = config.data;
    var width = config.width || 350;
    var height = config.height || 250;
    var title = config.title || 'IC Chart';
    var keys = ["insertions_fwd", "deletions_fwd", "insertions_rev", "deletions_rev"];

    var points = [];
    points.push(makePoints(data.cycle, data.ins_fwd));
    points.push(makePoints(data.cycle, data.del_fwd));
    points.push(makePoints(data.cycle, data.ins_rev));
    points.push(makePoints(data.cycle, data.del_rev));

    if (data && data.cycle && data.cycle.length !== 0) {
      results = dotPlot(points, 'Cycle', 'Indel', 1, title, keys, width, height);
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
