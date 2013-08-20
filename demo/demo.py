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
            var points = [];
            for (var i = files.length - 1; i >= 0; i--) {
                points.push(formatData(readFile(files[i])));
            }
	    function drawGraph () {
		d3.selectAll("svg").remove();
		if(i >= points.length){
		    i = points.length-1;
		}
		if(i < 0){
		    i = 0;
		}
		icChart(points[i])
		splitICchart(points[i]);
		isChart(points[i]);
		gcChart(points[i]);
		gccChart(points[i]);
		indelDist(points[i]);
		gcDepth(points[i]);
		coverage(points[i]);
	    }
	    $(window).keydown(function (e) {
		    if(e.which === 188){
			i--;
			drawGraph();
		    }
		    if(e.which === 190){
			i++;
			drawGraph();
		    }
		})
	    drawGraph();
        </script>
    </body>
</html>
""")
htmlFile.close()
