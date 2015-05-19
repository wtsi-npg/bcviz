require.config({
    baseUrl: '../',

    paths: {
        jquery: 'external/jquery/jquery',
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
var files;

  function handleFileSelect(evt) {
    files = evt.target.files; // FileList object

    // files is a FileList of File objects. List some properties.
    var output = [];
    for (var i = 0, f; f = files[i]; i++) {
      var button = "<input type='button' value='show' onClick='showCharts("+i+");'>";
      output.push('<tr><td>', button, '</td><td>', escape(f.name), '</td></tr>');
    }
    document.getElementById('list').innerHTML = '<table>' + output.join('') + '</table>';
  }

  document.getElementById('statsfile').addEventListener('change', handleFileSelect, false);


require(['src/bcviz'], function (bcviz) {

  showCharts = function(n) {

    // Check for the various File API support.
    if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
        alert('The File APIs are not fully supported in this browser.');
    }

    statsfile = files[n].name;
    if (!statsfile) { return; }

    var reader = new FileReader();
    reader.onload = (function(theFile) {
        var filedata=theFile.target.result.replace(/\r/g, "\n").split(/[\n]+/g);
    var d = jQuery('#charts');
    d.empty();
    try {
        var charts = bcviz.draw_charts({rawData: filedata});
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

    });
    reader.readAsText(files[n]);


    jQuery('#filename').html('Charts for file <b>'+statsfile+'</b>');
  };

});
