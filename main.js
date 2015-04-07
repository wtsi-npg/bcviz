require.config({
    baseUrl: '/js',

    paths: {
        jquery: 'lib/jquery/jquery',
        d3: 'lib/d3/d3'
    },
    shim: {
        d3: {
            //makes d3 available automatically for all modules
            exports: 'd3'
        }
    }
});
require(['src/readBCfile', 'src/qualityChart', 'src/ICcharts', 'src/ISchart', 'src/gcChart', 'src/gccChart', 'src/indelDist', 'src/GCDepth', 'src/coverage'], function (read, quality, ic, is, gc, gcc, id, gcDepth, coverage) {
    var files = ["demo/sample_1.bc","demo/sample_2.bc","demo/sample_3.bc","demo/sample_4.bc"];
    var initialNumberFiles = files.length;
    if(initialNumberFiles > 10){
        initialNumberFiles = 10;
    }
    var charts = [];
    var i = 0;
    var formattedData = [];
    function loadGraph (i) {
        if (formattedData[i] == null) {
            formattedData[i] = read(files[i]);
        }
    }
    function unloadGraph (i) {
        if (formattedData[i] != null) {
            formattedData[i] = null;
        }
    }
    function drawGraph (i) {
        charts = [];
        loadGraph(i);
        d3.selectAll("svg").remove();
        document.getElementById("fileName").innerHTML = "<h2>" + files[i].replace("%23", "#") + "</h2>";
        ic(formattedData[i], false, false, true);
        ic(formattedData[i], true, false, true);
        charts.push(quality(formattedData[i], "f", "      ", false, false));
        charts.push(quality(formattedData[i], "r", "      ", true, false));
        is(formattedData[i], false, true);
        gc(formattedData[i], false, true);
        gcc(formattedData[i], false, true);
        id(formattedData[i]);
        gcDepth(formattedData[i]);
        coverage(formattedData[i]);
    }
    function nextGraph() {
        i++;
        if(i >= files.length){
            i = files.length-1;
        }
        drawGraph(i);
        if (i - initialNumberFiles >= 0) {
            unloadGraph(i - initialNumberFiles);
        }
        if (i + initialNumberFiles < files.length) {
            loadGraph(i + initialNumberFiles + 1);
        }
    }
    function prevGraph() {
        i--;
        if(i < 0){
            i = 0;
        }
        drawGraph(i);
        if (i + initialNumberFiles < files.length) {
          unloadGraph(i + initialNumberFiles + 1);
        }
        if (i - initialNumberFiles >= 0) {
          loadGraph(i- initialNumberFiles);
        }
    }
    $(window).keydown(function (e) {
        if(e.which === 188){
            prevGraph();
        }
        if(e.which === 190){
            nextGraph();
        }
    });
    // draw (and load) the first graph
    drawGraph(0);
    // load the rest of the first 10 graphs as well
    for (var i = 1; i <= initialNumberFiles - 1; i++) {
        loadGraph(i);
    }
    i = 0;
    window.onresize = function () {
        for(var i = 0; i < charts.length; i++){
            if(charts[i])
                charts[i].resize();
        }
    };
});
