bcviz
=====

D3 based JavaScript visualisation for bamcheck file format


Creating and running demo:
--------------------------

1. Navigate to bcviz directory in terminal

3. Start a localhost server in the directory using python:

	python -m SimpleHTTPServer 8888 &

4. In your browser go to: 
	
	http://localhost:8888/

Running tests:
--------------

To look at the tests:
http://localhost:8888

To run headless:
phantomjs js/run-qunit.js test.html
