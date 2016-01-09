
"use strict";
require.config({
  baseUrl: '../',
  paths: {
    jquery: 'external/jquery/dist/jquery',
    d3:     'external/d3/d3'
  },
  shim: {
    d3: { exports: 'd3' }
  }
});

require(['test/qcjson/insertSizeHistogram','test/qcjson/adapter', 'test/qcjson/mismatch'],  
  function(insertSizeHistogram, adapter, mismatch) {
    // load the tests.
    adapter.run();
    insertSizeHistogram.run();
    mismatch.run();
    // run the tests.
    QUnit.start();
  }
);

