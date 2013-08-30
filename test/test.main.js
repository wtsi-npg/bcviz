var tests = [];
for (var file in window.__karma__.files) {
  if (window.__karma__.files.hasOwnProperty(file)) {
    if (/Spec\.js$/.test(file)) {
      tests.push(file);
    }
  }
}
require.config({
	// Karma serves files from '/base'
    baseUrl: '/base/js',

    paths: {
        jquery: 'lib/jquery-2.0.3',
        d3: 'lib/d3',
        chai: '/base/test/chai-1.7.2'
    },
    shim: {
        d3: {
            exports: 'd3'
        }
    },

    // ask Require.js to load these files (all our tests)
    deps: tests,

    // start test run, once Require.js is done
    callback: window.__karma__.start
});
