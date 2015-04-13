
"use strict";
require.config({
  baseUrl: '../',
  paths: {
    jquery: 'external/jquery/jquery',
    d3:     'external/d3/d3',
    QUnit:  'external/qunit/qunit/qunit',
  },
  shim: {
    d3: { exports: 'd3' },
    QUnit: {
      exports: 'QUnit',
      init: function() {
        QUnit.config.autoload = false;
        QUnit.config.autostart = false;
      }
    }
  }
});

require(['QUnit', 'test/qcjson/insertSizeHistogram','test/qcjson/adapter', 'test/qcjson/mismatch'],  
  function(QUnit, insertSizeHistogram, adapter, mismatch) {
    QUnit.load();
    // run the tests.
    adapter.run();
    insertSizeHistogram.run();
    mismatch.run();
    // start QUnit.
    QUnit.start();
  }
);

