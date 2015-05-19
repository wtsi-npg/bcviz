
"use strict";
require.config({
  baseUrl: '../',
  paths: {
    jquery: 'external/jquery/jquery',
    d3:     'external/d3/d3'
  },
  shim: {
    d3: { exports: 'd3' }
  }
});

require(['test/qcjson/insertSizeHistogram',
         'test/qcjson/adapter', 
         'test/qcjson/mismatch',
         'test/qcjson/gcdepth',
         'test/bcviz',
],  
  function(insertSizeHistogram, adapter, mismatch, gcdepth, bcviz) {
    // run the tests.
    bcviz.run();
    adapter.run();
    insertSizeHistogram.run();
    mismatch.run();
    gcdepth.run();
    QUnit.start();
  }
);

