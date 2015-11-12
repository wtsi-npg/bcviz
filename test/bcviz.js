"use strict";
define(
  ['../src/bcviz'],
  function(bcviz) {
    var run = function() {
      QUnit.test('bcviz tests', function() {
        var args = {
          'filename':'sample.stats',
          'width': 250,
          'height': 250,
        };
        var chart_list = bcviz.list_charts();
        QUnit.equal(Object.keys(chart_list).length, 10, 'found correct number of chart types');

        var charts = bcviz.draw_charts(args);
        chart_list = bcviz.list_charts();

        QUnit.ok(charts,"Created charts ok");
        QUnit.equal(Object.keys(charts).length,8,"Created correct number of charts");
        QUnit.ok(charts.gcdepth.graph,"Created gcdepth graph ok");
        QUnit.ok(charts.gcdepth.legend,"Created gcdepth legend ok");

        jQuery('#bcviz_bamcheck').append( function(){return charts.gcdepth.graph.node();} );
        jQuery('#bcviz_bamcheck').append( function(){return charts.gcdepth.legend.node();} );
        jQuery('#bcviz_bamcheck').append( function(){return charts.coverage.graph.node();} );
        jQuery('#bcviz_bamcheck').append( function(){return charts.gccchart.graph.node();} );
        jQuery('#bcviz_bamcheck').append( function(){return charts.gccchart.legend.node();} );
        jQuery('#bcviz_bamcheck').append( function(){return charts.gcchart.graph.node();} );
        jQuery('#bcviz_bamcheck').append( function(){return charts.gcchart.legend.node();} );
        jQuery('#bcviz_bamcheck').append( function(){return charts.icchart.graph.node();} );
        jQuery('#bcviz_bamcheck').append( function(){return charts.icchart.legend.node();} );
        jQuery('#bcviz_bamcheck').append( function(){return charts.indeldist.graph.node();} );
        jQuery('#bcviz_bamcheck').append( function(){return charts.ischart.graph.node();} );
        jQuery('#bcviz_bamcheck').append( function(){return charts.ischart.legend.node();} );
        jQuery('#bcviz_bamcheck').append( function(){return charts.quality.graph_fwd.node();} );
        jQuery('#bcviz_bamcheck').append( function(){return charts.quality.graph_rev.node();} );
        jQuery('#bcviz_bamcheck').append( function(){return charts.quality.legend.node();} );
      });

      QUnit.test('bcviz subgraph tests', function() {
        var args = {
          filename:'sample.stats',
          width: 250,
          height: 250,
          charts: ['coverage'],
        };
        var chart_list = bcviz.list_charts();
        QUnit.equal(Object.keys(chart_list).length, 10, 'found correct number of chart types');

        var charts = bcviz.draw_charts(args);
        QUnit.ok(charts,"Created charts ok");
        QUnit.equal(Object.keys(charts).length,1,"Created correct number of charts");
        QUnit.ok(charts.coverage.graph,"Created coverage graph ok");

      });


      QUnit.test('bcviz exceptions', function() {
        var args = {
          width: 250,
          height: 250,
          charts: ['coverage'],
        };
        var msg = '';
        try {
        bcviz.draw_charts(args);
        }
        catch (err) { msg=err; }
        QUnit.equal(msg,'There is no data to chart', 'no data exception');

        args.filename = 'no_such_file';
        try {
          bcviz.draw_charts(args);
        }
        catch (err) { msg=err; }
        QUnit.ok(msg,'file not found exception');
      });

    };
    return {run: run}
  }
);

