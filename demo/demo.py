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
        <link rel="stylesheet" type="text/css" href="css/myStyle.css">
        <script data-main="main" src="js/lib/require.js"></script>
    </head>
    <body>
        <div id="instructions">
            <p>To switch to another set of bamcheck graphs, use the &quot;.&quot; key to move forward and the &quot;,&quot; key to move backwards.</p>
        </div>
        <div id="aDiv">
        </div>
    </body>
</html>
""")
htmlFile.close()
mainJS = open('main.js', 'w')
mainJS.write("""var files = [""" + fileString)

mainJS.write("""];
require.config({
    baseUrl: '/js',

    paths: {
        jquery: 'lib/jquery-2.0.3',
        d3: 'lib/d3'
    },
    shim: {
        d3: {
            exports: 'd3'
        }
    }
});
require(['src/readBCfile', 'src/qualityChart', 'src/ICcharts', 'src/ISchart', 'src/gcChart', 'src/gccChart', 'src/indelDist', 'src/GCDepth', 'src/coverage'], function (read, quality, ic, is, gc, gcc, id, gcDepth, coverage) {
    var i = 0;
    var points = [];
    function loadGraph (i) {
        if (points[i] == null) {
            points[i] = read(files[i]);
        }
    }
    function unloadGraph (i) {
        if (points[i] != null) {
            points[i] = null;
        }
    }
    function drawGraph (i) {
        loadGraph(i);
        d3.selectAll("svg").remove();
        ic(points[i], false, false, true);
        ic(points[i], true, false, true);
        quality(points[i], "f", "      ", false, true);
        quality(points[i], "r", "      ", true, true);
        is(points[i], false, true);
        gc(points[i], false, true);
        gcc(points[i], false, true);
        id(points[i]);
        gcDepth(points[i]);
        coverage(points[i]);
    }
    function nextGraph() {
        i++;
        if(i >= files.length){
            i = files.length-1;
        }
        drawGraph(i);
        if (i-11 >= 0) {
            unloadGraph(i-11);
        }
        if (i+10 < files.length) {
            loadGraph(i+10);
        }
    }
    function prevGraph() {
        i--;
        if(i < 0){
            i = 0;
        }
        drawGraph(i);
        if (i+11 < files.length) {
          unloadGraph(i+11);
        }
        if (i-10 >= 0) {
          loadGraph(i-10);
        }
    }
    $(window).keydown(function (e) {
        if(e.which === 188){
            prevGraph();
        }
        if(e.which === 190){
            nextGraph();
        }
    })
    // draw (and load) the first graph
    drawGraph(0);
    // load the rest of the first 10 graphs as well
    for (var i = 1; i <= 9; i++) {
        loadGraph(i);
    }
});
""")
mainJS.close()
