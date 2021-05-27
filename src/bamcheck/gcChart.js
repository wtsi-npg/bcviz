/* globals define */

'use strict';

define(['d3', 'src/bamcheck/dotPlot'], function(d3, dotPlot) {
  var drawChart = function(config) {
    var results = {};
    var data = config.data;
    var width = config.width || 350;
    var height = config.height || 250;
    var title = config.title || 'gcChart';

    if (data && data.gc && data.gc.length !== 0) {
      var keysGC = ["First_Fragments", "Last_Fragments"];
      var points = [];

      // Normalise the frequency
      var maxGCF = d3.max(data.freq_first);
      var maxGCL = d3.max(data.freq_last);
      var maxGC = d3.max([maxGCF, maxGCL]);

      for (var i = 0; i < data.freq_first.length; i++) {
        data.freq_first[i] = data.freq_first[i] / maxGC;
      }
      for (var j = 0; j < data.freq_last.length; j++) {
        data.freq_last[j] = data.freq_last[j] / maxGC;
      }

      points.push(makePoints(data.gc, data.freq_first));
      points.push(makePoints(data.gc, data.freq_last));

      results =  dotPlot(points, 'GC Content (%)', 'Normalized Freuqency', 1, title, keysGC, width, height);
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
