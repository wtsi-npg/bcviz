bcviz
=====

D3 based JavaScript visualisation for bamcheck and NPG autoqc json file formats.

Requires bower to install package dependencies.

Creating and running demo:
--------------------------

1. Navigate to bcviz directory in terminal

2. Execute bower to install dependencies:

    bower install

3. Start a localhost server in the directory using python:

    python -m SimpleHTTPServer 8888 &

4. In your browser go to: 

    http://localhost:8888/demo

Running tests:
--------------

In a browser: http://localhost:8888/test/test.html

Headless: phantomjs test/run-qunit.js test/test.html

