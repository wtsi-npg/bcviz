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
        <script type="text/javascript" src="http://d3js.org/d3.v3.js"></script>
        <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
        <link rel="stylesheet" type="text/css" href="/css/myStyle.css">
        <script type="text/javascript" src="/js/dotPlot.js"></script>
        <script type="text/javascript" src="/js/qualityChart.js"></script>
        <script type="text/javascript" src="/js/rainbowvis.js"></script>
        <script type="text/javascript" src="/js/indelDist.js"></script>
        <script type="text/javascript" src="/js/coverage.js"></script>
        <script type="text/javascript" src="/js/GCDepth.js"></script>
        <script type="text/javascript" src="/js/readBCfile.js"></script>
    </head>
    <body>
        <script>
            var files = [""" + fileString)

htmlFile.write("""];
            var points = [];
            for (var i = files.length - 1; i >= 0; i--) {
                points.push(formatData(readFile(files[i])));
            }
            for (var i = points.length - 1; i >= 0; i--) {
                var title = files[i].replace("%23", "#")
                icChart(points[i], '', title);
                isChart(points[i], '#svg4', title);
                gcChart(points[i], '#svg5', title);
                gccChart(points[i], '#svg6', title);
                indelDist(points[i], '#svg7', title);
                gcDepth(points[i], '#svg8', title);
                coverage(points[i], '#svg9', title);
            };
        </script>
    </body>
</html>
""")
htmlFile.close()
