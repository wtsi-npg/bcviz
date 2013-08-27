require.config({
    paths: {
        jquery: 'lib/jquery-2.0.3',
        d3: 'lib/d3'
    },
    shim: {
        d3: {
            exports: 'd3'
        }
    }
});
require(['src/mismatch'], function (m) {
    jQuery.getJSON("demo/sample_sequence_error.json", function (data) {
        m(data, "#div1", true);
    });
});
require(['src/adapter'], function (a) {
    jQuery.getJSON("demo/sample_adapter.json", function (data) {
        a(data, "#div2", true);
    });
});
require(['src/insertSizeHistogram'], function (i) {
    jQuery.getJSON("demo/sample_insert_size.json", function (data) {
        i(data, "#div3", true);
    });
});