
"use strict";
require.config({
    paths: {
		jquery: '../js/lib/jquery/jquery',
		d3: '../js/lib/d3/d3',
        'QUnit': '../js/lib/qunit/qunit/qunit'
    },
    shim: {
		d3: { exports: 'd3' },
       'QUnit': {
           exports: 'QUnit',
           init: function() {
               QUnit.config.autoload = false;
               QUnit.config.autostart = false;
           }
       } 
    }
});

// require the unit tests.
require(
	['QUnit', '../test/insertSizeHistogram','../test/adapter', '../test/mismatch'],
	function(QUnit, insertSizeHistogram, adapter, mismatch) {
		// run the tests.
		adapter.run();
		insertSizeHistogram.run();
		mismatch.run();
		// start QUnit.
		QUnit.load();
		QUnit.start();
	}
);

