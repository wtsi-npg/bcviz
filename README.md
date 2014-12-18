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

5.  http://localhost:8888/index.html - visuals for json autoqc results

Running tests:
--------------

To look at the tests:
http://localhost:8888/test.html

To run headless:
phantomjs js/run-qunit.js file://`pwd`/test.html
