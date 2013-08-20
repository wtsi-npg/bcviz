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
        <script type="text/javascript" src="http://d3js.org/d3.v3.min.js"></script>
        <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
        <link rel="stylesheet" type="text/css" href="css/myStyle.css">
        <script type="text/javascript" src="js/dotPlot.js"></script>
        <script type="text/javascript" src="js/qualityChart.js"></script>
        <script type="text/javascript" src="js/rainbowvis.js"></script>
        <script type="text/javascript" src="js/indelDist.js"></script>
        <script type="text/javascript" src="js/coverage.js"></script>
        <script type="text/javascript" src="js/GCDepth.js"></script>
        <script type="text/javascript" src="js/readBCfile.js"></script>
    </head>
    <body>
        <div id="instructions">
          <p>To switch to another set of bamcheck graphs, use the &quot;.&quot; key to move forward and the &quot;,&quot; key to move backwards.</p>
        </div>
        <div id="aDiv">
        </div>
        <script>
            var files = [""" + fileString)

htmlFile.write("""];
            var i = 0;
            var points = [];
            function loadGraph (i) {
                if (points[i] == null) {
                  points[i] = formatData(readFile(files[i]));
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
		icChart(points[i])
		splitICchart(points[i]);
		isChart(points[i]);
		gcChart(points[i]);
		gccChart(points[i]);
		indelDist(points[i]);
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
        </script>
    </body>
</html>
""")
htmlFile.close()
