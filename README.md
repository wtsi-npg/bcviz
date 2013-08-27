bcviz
=====

D3 based JavaScript visualisation for bamcheck file format


Creating and running demo:
--------------------------

1. Navigate to bcviz directory in terminal
2. Run demo.py:

	python demo/demo.py

	when prompted for directory name enter demo

3. Start a localhost server in the directory using python:

	python -m SimpleHTTPServer 8888 &

4. In your browser go to: 
	
	http://localhost:8888/

   to see visuals for bamchek files. Step through individual files with '>' and '<'.

5.  http://localhost:8888/JSON_sample.html - visuals for json autoqc results

Running tests:
--------------
Prerequisites:
    karma javascript test runner http://karma-runner.github.io/0.10/index.html, ('npm install karma' to install)
    karma mocha - a karma plugin to run mocha http://visionmedia.github.io/mocha/ javascript test framework (npm install karma-mocha)

edit urlRoot parameter in bcviz/karma.confiq.js

PATH_TO_KARMA_BIN/karma start

