bcviz
=====

D3 based JavaScript visualisation for bamcheck and
NPG autoqc json file formats.

Requires nodejs (https://nodejs.org)
Requires bower (http://bower.io) to install package dependencies.
Requires node-qunit-phantomjs to run headless tests.
Requires grunt (http://gruntjs.com/) to automate tasks.

Running demos:
--------------

1. Navigate to bcviz directory in terminal

2. Execute bower to install dependencies:

    bower install

3. Start a localhost server in the directory using python:

    python -m SimpleHTTPServer 8888 &

4. In your browser go to:

    http://localhost:8888/demo

5. To generate a demo for your own data, change to demo/custom
   directory, execute demo.py script:

    python demo.py

   Follow the displayed prompt (test files are provided as part
   of this package and are located in the demo folder, ../ when executing
   python). The script generates index.html and main.js files that are
   specific to your input. The visuals are displayed at:

    http://localhost:8888/demo/custom

Building:
---------

Examples below assume that all tools are on your PATH.
If tools were installed locally, prepend their path to
the commands or amend your PATH env. variable.

Install node dependencies if they are not available.
Example for global install:
  npm install -g bower grunt-cli node-qunit-phantomjs

Install bcviz node dependencies (if grunt-cli is not installed
globally, it will be installed locally by this step):
  npm install

Install bcviz bower dependencies:
  bower install

If grunt was installed locally
  export PATH=${PWD}/node_modules/grunt-cli/bin:$PATH
Build with grunt:
  grunt -v build

Running tests:
--------------

Build the project then execute tests:

  In a browser:
    Start a localhost server in the directory using python:
      python -m SimpleHTTPServer 8888 &
    Open in a browser:
      http://localhost:8888/test/test.html

  Headless:
    node-qunit-phantomjs test/test.html --verbose

  Using grunt:
    grunt -v test

Preparing release:
------------------

Likely to be used in final stages of development cycle. Will build the project,
prepare minified versions with headers and place code in **dist** folder.

  grunt -v bump --setversion=X.Y.Z prepdist 