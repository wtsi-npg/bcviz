import glob
from urllib import quote
import os
import sys

inputDir = raw_input('Enter Directory Containing Files: ')
print
filetypes = ('*.bc', '*.bamcheck')
files = []
for filetype in filetypes:
    files.extend(glob.glob(os.path.relpath(os.path.join(inputDir, filetype))))
if not files:
    print 'No files found in Directory'
    sys.exit()
i = 0
for aFile in files:
    files[i] = quote(aFile)
    i = i + 1
fileString = ""
for aFile in files:
    fileString = fileString + "\",\"" + aFile
fileString = fileString[2:]
fileString = fileString + "\""
htmlFile = open('index.html', 'w')
htmlFile.write("""<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Bamcheck demo</title>
        <link rel="stylesheet" type="text/css" href="/src/css/bcviz.css">
        <script data-main="main" src="/external/requirejs/require.js"></script>
    </head>
    <body>
        <div id="instructions">
            <p>To switch to another set of bamcheck graphs, use the &quot;.&quot; key to move forward and the &quot;,&quot; key to move backwards.</p>
        </div>
        <div id="fileName">
        </div>
        <div id="aDiv">
        </div>
    </body>
</html>
""")
htmlFile.close()
mainJS = open('main.js', 'w')
mainJS.write("""require.config({
    baseUrl: '../../',

    paths: {
        jquery: 'external/jquery/dist/jquery',
        d3: 'external/d3/d3'
    },
    shim: {
        d3: {
            //makes d3 available automatically for all modules
            exports: 'd3'
        }
    }
});
require(['src/bamcheck/readBCfile', 'src/bamcheck/qualityChart', 'src/bamcheck/ICcharts', 'src/bamcheck/ISchart', 'src/bamcheck/gcChart', 'src/bamcheck/gccChart', 'src/bamcheck/indelDist', 'src/bamcheck/GCDepth', 'src/bamcheck/coverage'], function (read, quality, ic, is, gc, gcc, id, gcDepth, coverage) {
    var files = [""" + fileString)

mainJS.write("""];
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
""")
mainJS.close()
