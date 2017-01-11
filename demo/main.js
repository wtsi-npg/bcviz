require.config({
    baseUrl: '../',

    paths: {
        jquery: 'external/jquery/dist/jquery',
        d3: 'external/d3/d3',
    },
    shim: {
        d3: {
            //makes d3 available automatically for all modules
            exports: 'd3'
        }
    }
});

var showCharts;

require(['src/bcviz'], function (bcviz) {

  showCharts = function() {
    var statsfile = $('#statsfile').val();
    if (!statsfile) { return; }
    jQuery('#filename').html('Charts for file <b>'+statsfile+'</b>');
    var d = jQuery('#charts');
    d.empty();
    try {
    var charts = bcviz.draw_charts({filename: statsfile});
    }
    catch (msg) {
        d.html("<br><center><h2>"+msg+"</h2></center><br/>");
        return;
    }
    d.append( function(){return charts.gcdepth.graph.node();} );
    d.append( function(){return charts.gcdepth.legend.node();} );
    d.append( function(){return charts.coverage.graph.node();} );
    d.append( function(){return charts.gccchart.graph.node();} );
    d.append( function(){return charts.gccchart.legend.node();} );
    d.append( function(){return charts.gcchart.graph.node();} );
    d.append( function(){return charts.gcchart.legend.node();} );
    d.append( function(){return charts.icchart.graph.node();} );
    d.append( function(){return charts.icchart.legend.node();} );
    d.append( function(){return charts.indeldist.graph.node();} );
    d.append( function(){return charts.ischart.graph.node();} );
    d.append( function(){return charts.ischart.legend.node();} );
    d.append( function(){return charts.quality.graph_fwd.node();} );
    d.append( function(){return charts.quality.graph_rev.node();} );
    d.append( function(){return charts.quality.legend.node();} );
  };
});
