/*
 * Author: Jennifer Liddle <js10@sanger.ac.uk>
 *
 * Created: 14th July 2015
 *
 * Generate all the graphs
 *
 * Use:
 *
 * var charts = bcviz.draw_charts({'filename': 'sample.stats'});
 *
 * Where :     filename             is the name of a stats file
 *
 * Returns : an charts object containing all the graphs
 *
 */

define(['jquery', 'd3', 
        'src/bamcheck/coverage', 
        'src/bamcheck/gccChart', 
        'src/bamcheck/gcChart', 
        'src/bamcheck/GCDepth', 
        'src/bamcheck/ICcharts', 
        'src/bamcheck/indelDist', 
        'src/bamcheck/ISchart', 
        'src/bamcheck/qualityChart', 
       ],
function (jQuery, d3, coverage, gccchart, gcchart, gcdepth, icchart, indeldist, ischart, qualitychart) {
  var all_the_charts = {
    GCD: {
      name: 'gcdepth',
      graph_function: function(args) { return gcdepth.drawChart(args); },
      gcpercent: [],
      pc_us: [],
      pc_10: [],
      pc_25: [],
      pc_50: [],
      pc_75: [],
      pc_90: [],
    },
    COV: {
      name: 'coverage',
      graph_function: function(args) { return coverage.drawChart(args); },
      bases: [],
      cov: [],
    },
    GCC: {
      name: 'gccchart',
      graph_function: function(args) { return gccchart.drawChart(args); },
      cycle: [],
      base_A: [],
      base_C: [],
      base_G: [],
      base_T: [],
    },
    GCF: {
      name: 'gcchart',
      graph_function: function(args) { return gcchart.drawChart(args); },
      gc: [],
      freq_first: [],
      freq_last: [],
    },
    GCL: {
      name: 'gcchart_last',
    },
    IC: {
      name: 'icchart',
      graph_function: function(args) { return icchart.drawChart(args); },
      cycle: [],
      ins_fwd: [],
      ins_rev: [],
      del_fwd: [],
      del_rev: [],
    },
    ID: {
      name: 'indeldist',
      graph_function: function(args) { return indeldist.drawChart(args); },
      len: [],
      ins: [],
      del: [],
    },
    IS: {
      name: 'ischart',
      graph_function: function(args) { return ischart.drawChart(args); },
      size: [],
      total: [],
      inwards: [],
      outwards: [],
      other: [],
    },
    FFQ: {
      name: 'quality',
      graph_function: function(args) { return qualitychart.drawChart(args); },
      cycle: [],
      qual_first: [],
      qual_last: [],
    },
    LFQ: {
      name: 'quality_last',
    },
  };

  // Return the list of available charts
  var list_charts = function() {
    return all_the_charts;
  };

  //
  // Generate the actual charts
  //
  var draw_charts = function (config) {
    if (config.filename) {
        try {
        config.rawData = readFile(config.filename);
        }
        catch (msg) {
            throw msg ;
        }
    } 

    if (!config.rawData) {
        throw "There is no data to chart";
    }

    // get the list of charts to generate
    var charts_wanted = [];
    if (config.charts) {
      charts_wanted = config.charts;
    } else {
      for (var c in all_the_charts) {
        charts_wanted.push(all_the_charts[c].name);
      }
    }

    // now process the data
    for (var i=0;  i < config.rawData.length; i++) {
      var row = config.rawData[i];
      if (!jQuery.isArray(row)) {
        row = row.split("\t");
      }
      var graphCode = row[0];
      if (graphCode in all_the_charts) {
        var g = all_the_charts[graphCode];
        var graphName = g.name;
        if (jQuery.inArray(graphName, charts_wanted) == -1) { continue; }
        switch(graphName) {
          case 'gcdepth':
            if (+row[2] > 0.1 && +row[2] < 99.9) {
              g.gcpercent.push(+row[1]);
              g.pc_us.push(+row[2]);
              g.pc_10.push(+row[3]);
              g.pc_25.push(+row[4]);
              g.pc_50.push(+row[5]);
              g.pc_75.push(+row[6]);
              g.pc_90.push(+row[7]);
            }
            break;
          case 'coverage':
            g.bases.push(+row[2]);
            g.cov.push(+row[3]);
            break;
          case 'gccchart':
            g.cycle.push(+row[1]);
            g.base_A.push(+row[2]);
            g.base_C.push(+row[3]);
            g.base_G.push(+row[4]);
            g.base_T.push(+row[5]);
            break;
          case 'gcchart':
            g.gc.push(+row[1]);
            g.freq_first.push(+row[2]);
            break;
          case 'gcchart_last':
            g = all_the_charts['GCF'];  // rather hacky :-(
            g.freq_last.push(+row[2]);
            break;
          case 'icchart':
            g.cycle.push(+row[1]);
            g.ins_fwd.push(+row[2]);
            g.ins_rev.push(+row[3]);
            g.del_fwd.push(+row[4]);
            g.del_rev.push(+row[5]);
            break;
          case 'indeldist':
            g.len.push(+row[1]);
            g.ins.push(+row[2]);
            g.del.push(+row[3]);
            break;
          case 'ischart':
            g.size.push(+row[1]);
            g.total.push(+row[2]);
            g.inwards.push(+row[3]);
            g.outwards.push(+row[4]);
            g.other.push(+row[5]);
            break;
          case 'quality':
            g.cycle.push(+row[1]);
            var quals = [];
            for (var n=2; n < row.length; n++) {
              quals.push(+row[n]);
            }
            g.qual_first.push(quals);
            break;
          case 'quality_last':
            g = all_the_charts['FFQ'];  // hacky :-(
            var quals = [];
            for (var n=2; n < row.length; n++) {
              quals.push(+row[n]);
            }
            g.qual_last.push(quals);
        }
      }
    }

    // now generate the charts
    var results = {};
    for (var graphcode in all_the_charts) {
      var c = all_the_charts[graphcode];
      if (jQuery.inArray(c.name, charts_wanted) != -1) {
        if (c.graph_function) {
          var chart = c.graph_function({data: c, width: config.width, height: config.height});
          results[c.name] = {
            graph: chart.svg, 
            graph_fwd: chart.svg_fwd, 
            graph_rev: chart.svg_rev, 
            legend: chart.legend,
          };
        }
      }
    }

    //
    // release the data
    //
    for (var g in all_the_charts) {
        var c = all_the_charts[g];
        for (var d in c) {
            if (Array.isArray(c[d])) {
                c[d] = [];
            }
        }
    }

    return results;
  };

  //
  // Read a stats file
  //
  function readFile(filename) {
    var returnValue = null;
    var msg = '';

    jQuery.ajax({
      type: "GET",
      dataType: "text",
      async: false,
      url: filename,
      crossDomain: true,
      success: function (text) {
        returnValue = d3.tsv.parseRows(text);
      },
      error: function (x, status, error) {
        msg = status + ": " + error;
      }
    });
    if (msg) { throw msg; }
    return returnValue;
  };



  return {
    list_charts: list_charts,
    draw_charts: draw_charts,
  };
});
