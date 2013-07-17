import glob
from urllib import quote

inputDir = raw_input('Enter Directory Containing Files: ')
print
filetypes = ('*.bc', '*.bamcheck')
files = []
for filetype in filetypes:
    files.extend(glob.glob(inputDir + filetype))
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
htmlFile.write("""
<html>
    <head>
        <meta charset="utf-8">
        <title>Bamcheck demo</title>
        <script src="http://d3js.org/d3.v3.js"></script>
        <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
        <link rel="stylesheet" type="text/css" href="myStyle.css">
        <script src="lineChart.js"></script>
        <script src="qualityChart.js"></script>
        <script src="rainbowvis.js"></script>
        <script src="indelDist.js"></script>
        <script src="coverage.js"></script>
        <script src="GCDepth.js"></script>
        <script src="readBCfile.js"></script>
    </head>
    <body>
        <script>
            var files = [""" + fileString)

htmlFile.write("""];
            var points = [];
            points.push(formatData(readFile(files[0])));
            icChart(points[0], '#svg3');
        </script>
    </body>
</html>
""")
htmlFile.close()
