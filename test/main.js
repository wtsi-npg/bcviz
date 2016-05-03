
"use strict";
requirejs.config({
  baseUrl: '../',
  paths: {
    'qunit': 'external/qunit/qunit/qunit',
    jquery:  'external/jquery/dist/jquery',
    d3:      'external/d3/d3'
  },
  shim: {
    d3: { exports: 'd3' }
  }
});

requirejs(['test/qcjson/insertSizeHistogram','test/qcjson/adapter', 'test/qcjson/mismatch'],  
  function(insertSizeHistogram, adapter, mismatch) {
    // start QUnit because it was told to wait in the html.
    QUnit.config.autostart = false;
    // load the tests.
    adapter.run();
    insertSizeHistogram.run();
    mismatch.run();
    QUnit.start();
  }
);

